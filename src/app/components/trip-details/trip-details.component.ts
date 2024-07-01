import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private router: Router,
    private snackBar: MatSnackBar
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

  handleActivityClick(id: string | undefined) {
    if (id) {
      this.router.navigate([
        `trip/${this.activatedRoute.snapshot.params['id']}/itinerary/`,
        id,
      ]);
    } else {
      this.snackBar.open(
        'There was a problem loading the itinerary. Please try again.',
        'Close',
        {
          duration: 5000,
          panelClass: ['snackbar-error'],
        }
      );
    }
  }

  handleHomeClick() {
    this.router.navigate(['/home']);
  }
}
