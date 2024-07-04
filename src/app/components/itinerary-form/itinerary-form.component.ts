import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItineraryFormComponent {
  @Input() set activity(activity: ItineraryItem | null) {
    if (activity) {
      this.activityForm.setValue({
        id: activity.id ?? '',
        title: activity.title ?? '',
        startDate: activity.startDate.toDate() ?? new Date(),
        endDate: activity.endDate.toDate() ?? new Date(),
        cost: activity.cost ?? 0,
        currency: activity.currency ?? 'ZAR',
        startLocation: activity.startLocation ?? new GeoPoint(0, 0),
        endLocation: activity.endLocation ?? new GeoPoint(0, 0),
        notes: activity.notes ?? '',
        tag: activity.tag ?? '',
      });
    }
  }

  @Output() outputActivity = new EventEmitter<ItineraryItem>();
  @Output() cancelClicked = new EventEmitter();

  @ViewChild('tagModal')
  tagModalRef: ElementRef<HTMLDialogElement> | null = null;

  filter = filterConfig;
  currencies = currencies;

  activityForm = new FormGroup({
    id: new FormControl(''),
    title: new FormControl('', Validators.required),
    startDate: new FormControl<Date | Timestamp>(
      new Date(),
      Validators.required
    ),
    endDate: new FormControl<Date | Timestamp>(new Date(), Validators.required),
    cost: new FormControl(0, [Validators.required, Validators.min(0)]),
    currency: new FormControl('', Validators.required),
    startLocation: new FormControl(new GeoPoint(0, 0)),
    endLocation: new FormControl(new GeoPoint(0, 0)),
    notes: new FormControl(''),
    tag: new FormControl(''),
  });

  addActivity() {
    if (this.activityForm.valid) {
      if (this.activityForm.value.startDate instanceof Date) {
        this.activityForm.value.startDate = Timestamp.fromDate(
          this.activityForm.value.startDate
        );
      }
      if (this.activityForm.value.endDate instanceof Date) {
        this.activityForm.value.endDate = Timestamp.fromDate(
          this.activityForm.value.endDate
        );
      }

      if (this.activityForm.value.id === '') {
        const activity = {
          ...this.activityForm.value,
          id: uuid(),
        } as ItineraryItem;
        this.outputActivity.emit(activity);
        this.clearForm();
      } else {
        const activity = {
          ...this.activityForm.value,
        } as ItineraryItem;
        this.outputActivity.emit(activity);
        this.clearForm();
      }
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
    const tempId = this.activityForm.value.id ?? '';
    this.activityForm.reset();
    this.activityForm.patchValue({
      id: tempId,
    });
  }

  cancelEdit() {
    this.cancelClicked.emit();
  }
}
