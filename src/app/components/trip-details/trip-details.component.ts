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
import { ItineraryFormComponent } from '../itinerary-form/itinerary-form.component';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [
    ItineraryCardComponent,
    MatProgressSpinnerModule,
    AsyncPipe,
    DatePipe,
    CurrencyPipe,
    ItineraryFormComponent,
  ],
  templateUrl: './trip-details.component.html',
  styleUrl: './trip-details.component.scss',
})
export class TripDetailsComponent {
  @ViewChild('confirmModal')
  modalRef: ElementRef<HTMLDialogElement> | null = null;

  trip$ = this.store.select(selectSelectedTrip);
  loading$ = this.store.select(selectLoadingState);

  tripToUpdate = signal<Trip>({} as Trip);
  activityToDelete = signal<ItineraryItem>({} as ItineraryItem);
  activityToEdit = signal<ItineraryItem>({} as ItineraryItem);
  tripId = signal<string>(this.activatedRoute.snapshot.params['id']);

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
            tripId: this.tripId(),
          })
        );
      } else {
        this.tripToUpdate.set(trip);
      }
    });
  }

  closeModal() {
    this.modalRef?.nativeElement.close();
  }

  openModal() {
    this.modalRef?.nativeElement.showModal();
  }

  handleDeleteActivityClick(selectedActivity: ItineraryItem) {
    this.activityToDelete.set(selectedActivity);
    this.openModal();
  }

  deleteActivity() {
    if (this.tripToUpdate()?.docId && this.tripToUpdate()?.docId !== '') {
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
      this.router.navigate([`trip/${this.tripId()}/itinerary/`, id]);
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

  setActivityToEdit(activity: ItineraryItem) {
    this.activityToEdit.set(activity);
  }

  cleatActivityToEdit() {
    this.activityToEdit.set({} as ItineraryItem);
  }

  updateActivity(activity: ItineraryItem) {
    if (this.tripToUpdate()?.docId && this.tripToUpdate()?.docId !== '') {
      const newActivities = this.tripToUpdate().itinerary?.map(act =>
        act.id === activity.id ? activity : act
      );
      this.store.dispatch(
        updateTrip({
          trip: {
            ...this.tripToUpdate(),
            itinerary: newActivities,
          },
        })
      );
      this.activityToEdit.set({} as ItineraryItem);
    }
  }

  returnHome() {
    this.router.navigate(['/home']);
  }
}
