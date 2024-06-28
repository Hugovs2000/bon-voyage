import { CurrencyPipe } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  InputSignal,
  Output,
  ViewChild,
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
import { v4 as uuid } from 'uuid';
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

  @ViewChild('tagModal')
  tagModalRef: ElementRef<HTMLDialogElement> | null = null;

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
    cost: new FormControl(this.inputActivity().cost ?? 0, [
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
      const activity = {
        ...this.activityForm.value,
        id: uuid(),
      } as ItineraryItem;
      this.outputActivity.emit(activity);
      this.activityForm.reset();
    }
  }

  cancelTag() {
    this.activityForm.get('tag')?.reset();
    this.closeTagModal();
  }

  openTagModal() {
    this.tagModalRef?.nativeElement.showModal();
  }

  closeTagModal() {
    this.tagModalRef?.nativeElement.close();
  }

  clearForm() {
    this.activityForm.reset();
  }
}
