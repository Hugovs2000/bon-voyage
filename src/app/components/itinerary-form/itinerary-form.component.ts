import { CurrencyPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  InputSignal,
  Output,
  input,
} from '@angular/core';
import { GeoPoint, Timestamp } from '@angular/fire/firestore';
import {
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
import { ItineraryItem, currencies } from '../../models/trips';
import { filterConfig } from '../../utils/filterCalendar';

@Component({
  selector: 'app-itinerary-form',
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
  templateUrl: './itinerary-form.component.html',
  styleUrl: './itinerary-form.component.scss',
})
export class ItineraryFormComponent {
  inputActivity: InputSignal<ItineraryItem> = input<ItineraryItem>(
    {} as ItineraryItem
  );

  @Output() outputActivity = new EventEmitter<ItineraryItem>();

  filter = filterConfig;
  currencies = currencies;

  activityForm = new FormGroup({
    title: new FormControl(
      this.inputActivity().title ?? '',
      Validators.required
    ),
    startDate: new FormControl<Date | Timestamp | null>(
      this.inputActivity().startDate ?? Timestamp.now(),
      Validators.required
    ),
    endDate: new FormControl<Date | Timestamp | null>(
      this.inputActivity().endDate ?? Timestamp.now(),
      Validators.required
    ),
    cost: new FormControl(this.inputActivity().cost ?? null, [
      Validators.required,
      Validators.min(0),
    ]),
    currency: new FormControl(
      this.inputActivity().currency ?? '',
      Validators.required
    ),
    startLocation: new FormControl(
      this.inputActivity().startLocation ?? new GeoPoint(0, 0)
    ),
    endLocation: new FormControl(
      this.inputActivity().endLocation ?? new GeoPoint(0, 0)
    ),
    notes: new FormControl(this.inputActivity().notes ?? ''),
    tag: new FormControl(this.inputActivity().tag ?? ''),
  });

  addActivity() {
    if (this.activityForm.valid) {
      this.outputActivity.emit(this.activityForm.value as ItineraryItem);
      this.activityForm.reset();
    }
  }

  cancelTag() {
    this.activityForm.get('tag')?.reset();
    const modalRef = document.getElementById('tagModal') as HTMLDialogElement;
    if (modalRef) {
      modalRef.close();
    }
  }

  clearForm() {
    this.activityForm.reset();
  }
}
