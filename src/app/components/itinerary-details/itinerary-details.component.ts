import { CurrencyPipe } from '@angular/common';
import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ItineraryItem, Trip } from '../../models/trips';
import { setSelectedTripId, updateTrip } from '../../store/trips/actions';
import { TripState } from '../../store/trips/reducer';
import {
  selectLoadingState,
  selectSelectedTrip,
} from '../../store/trips/selectors';
import { selectBaseCurrency } from '../../store/user/selectors';
import { MapComponent } from '../map/map.component';
import { StepsComponent } from '../steps/steps.component';

@Component({
  selector: 'app-itinerary-details',
  standalone: true,
  imports: [
    StepsComponent,
    CurrencyPipe,
    RouterLink,
    MapComponent,
    MatIconModule,
  ],
  templateUrl: './itinerary-details.component.html',
  styleUrl: './itinerary-details.component.scss',
})
export class ItineraryDetailsComponent {
  @ViewChild('confirmModal')
  modalRef: ElementRef<HTMLDialogElement> | null = null;

  selectedTrip$ = this.tripStore.select(selectSelectedTrip);

  loading = toSignal(this.tripStore.select(selectLoadingState), {
    initialValue: false,
  });
  baseCurrency = toSignal(this.userStore.select(selectBaseCurrency), {
    initialValue: 'ZAR',
  });
  tripId = signal<string>(this.activatedRoute.snapshot.params['id']);
  activityId = signal<string>(
    this.activatedRoute.snapshot.params['itineraryId']
  );
  tripToUpdate = signal<Trip | null>(null);
  activity = signal<ItineraryItem | null>(null);
  newStartDate = signal<Date>(new Date());
  newEndDate = signal<Date>(new Date());

  constructor(
    private activatedRoute: ActivatedRoute,
    private tripStore: Store<TripState>,
    private userStore: Store<TripState>,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.selectedTrip$.pipe(takeUntilDestroyed()).subscribe(trip => {
      if (!trip) {
        this.tripStore.dispatch(
          setSelectedTripId({
            tripId: this.tripId(),
          })
        );
      } else {
        this.tripToUpdate.set(trip);
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

  closeModal() {
    this.modalRef?.nativeElement.close();
  }

  openModal() {
    this.modalRef?.nativeElement.showModal();
  }

  handleDeleteClick() {
    this.openModal();
  }

  deleteActivity() {
    if (this.tripToUpdate()?.docId) {
      const newActivities = this.tripToUpdate()?.itinerary?.filter(
        act => act.id !== this.activityId()
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
      this.router.navigate(['/trip', this.tripId()]);
    }
  }
}
