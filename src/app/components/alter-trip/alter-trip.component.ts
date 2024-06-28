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
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { ItineraryItem, Trip } from '../../models/trips';
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
  ],
  templateUrl: './alter-trip.component.html',
  styleUrl: './alter-trip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlterTripComponent {
  inputTrip: InputSignal<Trip> = input<Trip>({} as Trip);

  private store = inject(Store<TripState>);

  loading$ = this.store.select(selectLoadingState);
  selectedActivity = signal<ItineraryItem>({} as ItineraryItem);

  tripForm = new FormGroup({
    title: new FormControl('', Validators.required),
    userId: new FormControl('abc', Validators.required),
    itinerary: new FormArray([]),
  });

  get itineraryForm() {
    return this.tripForm.get('itinerary') as FormArray;
  }

  addActivity(activity: ItineraryItem) {
    if (activity.startDate instanceof Date) {
      activity.startDate = Timestamp.fromDate(activity.startDate);
    }
    if (activity.endDate instanceof Date) {
      activity.endDate = Timestamp.fromDate(activity.endDate);
    }

    this.itineraryForm.push(
      new FormGroup({
        title: new FormControl(activity.title, Validators.required),
        startDate: new FormControl<Timestamp>(
          activity.startDate,
          Validators.required
        ),
        endDate: new FormControl<Timestamp>(
          activity.endDate,
          Validators.required
        ),
        cost: new FormControl(activity.cost, [
          Validators.required,
          Validators.min(0),
        ]),
        currency: new FormControl(activity.currency, Validators.required),
        startLocation: new FormControl(activity.startLocation),
        endLocation: new FormControl(activity.endLocation),
        notes: new FormControl(activity.notes),
        tag: new FormControl(activity.tag),
      })
    );
  }

  removeActivity(index: number) {
    this.itineraryForm.removeAt(index);
  }

  onSubmit() {
    if (this.tripForm.valid && this.tripForm.value.itinerary) {
      for (const trip of this.tripForm.value.itinerary as ItineraryItem[]) {
        if (trip.startDate instanceof Date) {
          trip.startDate = Timestamp.fromDate(trip.startDate);
        }
        if (trip.endDate instanceof Date) {
          trip.endDate = Timestamp.fromDate(trip.endDate);
        }
      }
      const trip = { ...(this.tripForm.value as Trip), userId: 'abc' };

      this.store.dispatch(createNewTrip({ trip }));
      // TODO: navigate to trip details page on success
      // this.router.navigate(['/trip', trip.id]);
    }
  }
}
