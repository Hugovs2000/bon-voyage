import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { ItineraryItem, Trip } from '../../models/trips';
import { HasActivityPipe } from '../../pipes/has-activity.pipe';
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
import { ItineraryCardComponent } from '../itinerary-card/itinerary-card.component';
import { ItineraryFormComponent } from '../itinerary-form/itinerary-form.component';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [
    ItineraryCardComponent,
    AsyncPipe,
    DatePipe,
    CurrencyPipe,
    ItineraryFormComponent,
    RouterLink,
    NzCalendarModule,
    NzBadgeModule,
    NzStepsModule,
    MatIconModule,
    HasActivityPipe,
  ],
  templateUrl: './trip-details.component.html',
  styleUrl: './trip-details.component.scss',
})
export class TripDetailsComponent {
  @ViewChild('confirmDeleteActivityModal')
  actModalRef: ElementRef<HTMLDialogElement> | null = null;
  @ViewChild('confirmDeleteTripModal')
  tripModalRef: ElementRef<HTMLDialogElement> | null = null;

  trip$ = this.tripStore.select(selectSelectedTrip);
  loading$ = this.tripStore.select(selectLoadingState);
  exchangeRates$ = this.tripStore.select(selectExchangeRates);
  baseCurrency$ = this.userStore.select(selectBaseCurrency);

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
    this.trip$.pipe(takeUntilDestroyed()).subscribe(trip => {
      if (!trip) {
        this.tripStore.dispatch(
          setSelectedTripId({
            tripId: this.tripId(),
          })
        );
      } else {
        this.tripToUpdate.set(trip);
      }
    });
  }

  getDateWithoutTime(date: Date): Date {
    date.setHours(0, 0, 0, 0);
    return date;
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
