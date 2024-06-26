import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  InputSignal,
  inject,
  input,
  signal,
} from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { ItineraryItem, Trip } from '../../models/trips';
import { AuthService } from '../../services/auth.service';
import { createNewTrip } from '../../store/trips/actions';
import { TripState } from '../../store/trips/reducer';
import { selectLoadingState } from '../../store/trips/selectors';
import { ItineraryCardComponent } from '../itinerary-card/itinerary-card.component';
import { ItineraryFormComponent } from '../itinerary-form/itinerary-form.component';

@Component({
  selector: 'app-alter-trip',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    ItineraryCardComponent,
    ItineraryFormComponent,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './alter-trip.component.html',
  styleUrl: './alter-trip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlterTripComponent {
  inputTrip: InputSignal<Trip> = input<Trip>({} as Trip);
  selectedActivity = signal<ItineraryItem>({} as ItineraryItem);

  private store = inject(Store<TripState>);
  private authService = inject(AuthService);

  loading$ = this.store.select(selectLoadingState);

  itinerary: ItineraryItem[] = [];

  tripForm = new FormGroup({
    title: new FormControl('', Validators.required),
    userId: new FormControl(
      this.authService.userId ?? 'abc',
      Validators.required
    ),
  });

  addActivity(activity: ItineraryItem) {
    if (activity.startDate instanceof Date) {
      activity.startDate = Timestamp.fromDate(activity.startDate);
    }
    if (activity.endDate instanceof Date) {
      activity.endDate = Timestamp.fromDate(activity.endDate);
    }

    this.itinerary.push(activity);
  }

  removeActivity(activity: ItineraryItem) {
    this.itinerary = this.itinerary.filter(act => act.id !== activity.id);
  }

  onSubmit() {
    if (
      this.tripForm.valid &&
      this.tripForm.value.userId &&
      this.tripForm.value.userId !== 'abc'
    ) {
      for (const activity of this.itinerary) {
        if (activity.startDate instanceof Date) {
          activity.startDate = Timestamp.fromDate(activity.startDate);
        }
        if (activity.endDate instanceof Date) {
          activity.endDate = Timestamp.fromDate(activity.endDate);
        }
      }

      const trip = {
        ...this.tripForm.value,
        itinerary: this.itinerary,
      } as Trip;

      this.store.dispatch(createNewTrip({ trip }));
    }
  }
}
