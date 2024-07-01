import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ItineraryItem } from '../../models/trips';
import { getAllTrips, setSelectedTripId } from '../../store/trips/actions';
import { TripState } from '../../store/trips/reducer';
import {
  selectLoadingState,
  selectSelectedTrip,
} from '../../store/trips/selectors';
import { deriveDuration } from '../../utils/deriveDatesAndCost';

@Component({
  selector: 'app-itinerary-details',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, DatePipe, MatProgressSpinnerModule],
  templateUrl: './itinerary-details.component.html',
  styleUrl: './itinerary-details.component.scss',
})
export class ItineraryDetailsComponent {
  selectedTrip$ = this.store.select(selectSelectedTrip);
  loading$ = this.store.select(selectLoadingState);

  tripId = signal<string>(this.activatedRoute.snapshot.params['id']);
  activityId = signal<string>(
    this.activatedRoute.snapshot.params['itineraryId']
  );
  activity = signal<ItineraryItem>({} as ItineraryItem);
  newStartDate = signal<Date>(new Date());
  newEndDate = signal<Date>(new Date());
  duration = signal<number>(0);

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<TripState>,
    private snackBar: MatSnackBar
  ) {
    this.selectedTrip$.pipe(takeUntilDestroyed()).subscribe(trip => {
      if (!trip) {
        this.store.dispatch(getAllTrips());
        this.store.dispatch(
          setSelectedTripId({
            tripId: this.tripId(),
          })
        );
      } else {
        const activity = trip.itinerary?.find(
          activity => activity.id === this.activityId()
        );
        if (activity) {
          this.activity.set(activity);
          if (activity.startDate) {
            this.newStartDate.set(activity.startDate.toDate());
          }
          if (activity.endDate) {
            this.newEndDate.set(activity.endDate.toDate());
          }
          this.duration.set(
            deriveDuration(this.newStartDate(), this.newEndDate())
          );
        } else {
          this.snackBar.open(
            'There was a problem finding the itinerary. Please try again.',
            'Close',
            {
              duration: 5000,
              panelClass: ['snackbar-error'],
            }
          );
        }
      }
    });
  }
}
