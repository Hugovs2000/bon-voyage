import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GeoPoint, Timestamp } from '@angular/fire/firestore';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { Trip, currencies } from '../../models/trips';
import { createNewTrip } from '../../store/trips/actions';
import { TripState } from '../../store/trips/reducer';
import { filterConfig } from '../../utils/filterCalendar';

@Component({
  selector: 'app-new-trip',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CurrencyPipe,
    MatIconModule,
  ],
  templateUrl: './new-trip.component.html',
  styleUrl: './new-trip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewTripComponent {
  private store = inject(Store<TripState>);

  filter = filterConfig;
  currencies = currencies;

  newTripForm = new FormGroup({
    title: new FormControl('', Validators.required),
    userId: new FormControl('abc', Validators.required),
    itinerary: new FormArray([
      new FormGroup({
        title: new FormControl('', Validators.required),
        startDate: new FormControl<Date | Timestamp | null>(
          null,
          Validators.required
        ),
        endDate: new FormControl<Date | Timestamp | null>(
          null,
          Validators.required
        ),
        cost: new FormControl(null, [Validators.required, Validators.min(0)]),
        currency: new FormControl('', Validators.required),
        startLocation: new FormControl(new GeoPoint(0, 0)),
        endLocation: new FormControl(new GeoPoint(0, 0)),
        notes: new FormControl(''),
        tag: new FormControl(''),
      }),
    ]),
  });

  get itineraryForms() {
    return this.newTripForm.get('itinerary') as FormArray;
  }

  onSubmit() {
    if (this.newTripForm.valid && this.newTripForm.value.itinerary) {
      for (const trip of this.newTripForm.value.itinerary) {
        if (trip.startDate instanceof Date) {
          trip.startDate = Timestamp.fromDate(trip.startDate);
        }
        if (trip.endDate instanceof Date) {
          trip.endDate = Timestamp.fromDate(trip.endDate);
        }
      }
      const trip = { ...(this.newTripForm.value as Trip), userId: 'abc' };
      this.store.dispatch(createNewTrip({ trip }));
    }
  }
}
