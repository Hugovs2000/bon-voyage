import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ItineraryItem, Trip } from '../../models/trips';
import {
  getAllTrips,
  setSelectedTripId,
  updateTrip,
} from '../../store/trips/actions';
import { TripState } from '../../store/trips/reducer';
import {
  selectLoadingState,
  selectSelectedTrip,
} from '../../store/trips/selectors';
import { ItineraryCardComponent } from '../itinerary-card/itinerary-card.component';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [
    ItineraryCardComponent,
    MatProgressSpinnerModule,
    AsyncPipe,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './trip-details.component.html',
  styleUrl: './trip-details.component.scss',
})
export class TripDetailsComponent {
  @ViewChild('confirmModal')
  modalRef: ElementRef<HTMLDialogElement> | null = null;

  trip$ = this.store.select(selectSelectedTrip);
  loading$ = this.store.select(selectLoadingState);

  tripToUpdate = signal<Trip | null>(null);
  activityToDelete = signal<ItineraryItem | null>(null);

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<TripState>,
    private router: Router
  ) {
    this.trip$.pipe(takeUntilDestroyed()).subscribe(trip => {
      if (!trip) {
        this.store.dispatch(getAllTrips());
        this.store.dispatch(
          setSelectedTripId({
            tripId: this.activatedRoute.snapshot.params['id'],
          })
        );
      }
    });
  }

  closeModal() {
    this.modalRef?.nativeElement.close();
  }

  openModal() {
    this.modalRef?.nativeElement.showModal();
  }

  handleDeleteActivityClick(trip: Trip, selectedActivity: ItineraryItem) {
    this.tripToUpdate.set(trip);
    this.activityToDelete.set(selectedActivity);
    this.openModal();
  }

  deleteActivity() {
    if (this.tripToUpdate()?.docId) {
      const newActivities = this.tripToUpdate()?.itinerary?.filter(
        act => act.id !== this.activityToDelete()?.id
      );
      this.store.dispatch(
        updateTrip({
          trip: {
            ...(this.tripToUpdate() ??
              ({ docId: this.tripToUpdate()?.docId } as Trip)),
            itinerary: newActivities,
          },
        })
      );
    }
  }

  handleHomeClick() {
    this.router.navigate(['/home']);
  }
}
