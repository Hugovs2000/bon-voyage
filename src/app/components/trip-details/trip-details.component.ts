import { CurrencyPipe } from '@angular/common';
import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ItineraryItem, Trip } from '../../models/trips';
import {
  deleteTrip,
  setSelectedTripId,
  updateTrip,
} from '../../store/trips/actions';
import { TripState } from '../../store/trips/reducer';
import {
  selectExchangeRates,
  selectLoadingState,
  selectSelectedTrip,
} from '../../store/trips/selectors';
import { UserState } from '../../store/user/reducer';
import { selectBaseCurrency } from '../../store/user/selectors';
import { CalendarComponent } from '../calendar/calendar.component';
import { ItineraryCardComponent } from '../itinerary-card/itinerary-card.component';
import { ItineraryFormComponent } from '../itinerary-form/itinerary-form.component';
import { StepsComponent } from '../steps/steps.component';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [
    CalendarComponent,
    ItineraryCardComponent,
    ItineraryFormComponent,
    StepsComponent,
    RouterLink,
    MatIconModule,
    CurrencyPipe,
  ],
  templateUrl: './trip-details.component.html',
  styleUrl: './trip-details.component.scss',
})
export class TripDetailsComponent {
  @ViewChild('confirmDeleteActivityModal')
  actModalRef: ElementRef<HTMLDialogElement> | null = null;
  @ViewChild('confirmDeleteTripModal')
  tripModalRef: ElementRef<HTMLDialogElement> | null = null;

  trip = toSignal(this.tripStore.select(selectSelectedTrip), {
    initialValue: null,
  });
  loading = toSignal(this.tripStore.select(selectLoadingState), {
    initialValue: false,
  });
  exchangeRates = toSignal(this.tripStore.select(selectExchangeRates));
  baseCurrency = toSignal(this.userStore.select(selectBaseCurrency), {
    initialValue: 'ZAR',
  });

  tripToUpdate = signal<Trip | null>(null);
  activityToDelete = signal<ItineraryItem | null>(null);
  activityToEdit = signal<ItineraryItem | null>(null);
  tripId = signal<string>(this.activatedRoute.snapshot.params['id']);

  constructor(
    private activatedRoute: ActivatedRoute,
    private tripStore: Store<TripState>,
    private userStore: Store<UserState>,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    if (!this.trip() || this.trip()?.docId !== this.tripId()) {
      this.tripStore.dispatch(
        setSelectedTripId({
          tripId: this.tripId(),
        })
      );
    } else {
      this.tripToUpdate.set(this.trip());
    }
  }

  closeModal() {
    this.actModalRef?.nativeElement.close();
    this.tripModalRef?.nativeElement.close();
  }

  confirmActivityDelete() {
    this.actModalRef?.nativeElement.showModal();
  }

  confirmTripDelete() {
    this.tripModalRef?.nativeElement.showModal();
  }

  handleDeleteActivityClick(selectedActivity: ItineraryItem) {
    this.activityToDelete.set(selectedActivity);
    this.confirmActivityDelete();
  }

  deleteActivity() {
    if (this.tripToUpdate()?.docId && this.tripToUpdate()?.docId !== '') {
      const newActivities = this.tripToUpdate()?.itinerary?.filter(
        act => act.id !== this.activityToDelete()?.id
      );
      this.tripStore.dispatch(
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

  handleActivityClick(id: string) {
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

  clearActivityToEdit() {
    this.activityToEdit.set(null);
  }

  updateActivity(activity: ItineraryItem) {
    if (this.tripToUpdate()?.docId && this.tripToUpdate()?.docId !== '') {
      const newActivities = this.tripToUpdate()?.itinerary?.map(act =>
        act.id === activity.id ? activity : act
      );
      this.tripStore.dispatch(
        updateTrip({
          trip: {
            ...this.tripToUpdate(),
            itinerary: newActivities ?? ([] as ItineraryItem[]),
          } as Trip,
        })
      );
      this.activityToEdit.set(null);
    }
  }

  addActivity(activity: ItineraryItem) {
    if (this.tripToUpdate()?.docId && this.tripToUpdate()?.docId !== '') {
      this.tripStore.dispatch(
        updateTrip({
          trip: {
            ...this.tripToUpdate(),
            itinerary: [...(this.tripToUpdate()?.itinerary ?? []), activity],
          } as Trip,
        })
      );
    }
  }

  deleteTrip() {
    this.tripStore.dispatch(
      deleteTrip({ tripId: this.tripToUpdate()?.docId ?? '' })
    );
  }
}
