import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  signal,
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
import { LatLng } from 'leaflet';
import { v4 as uuid } from 'uuid';
import { ItineraryItem, LeafletPosition, currencies } from '../../models/trips';
import { filterConfig } from '../../utils/filterCalendar';
import { MapComponent } from '../map/map.component';

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
    MapComponent,
  ],
  templateUrl: './itinerary-form.component.html',
  styleUrl: './itinerary-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItineraryFormComponent {
  @Input() set activity(activity: ItineraryItem | null) {
    if (activity) {
      this.locations.set(
        activity.startLocation?.latitude &&
          activity.startLocation?.longitude &&
          activity.endLocation?.latitude &&
          activity.endLocation.longitude
          ? [
              {
                position: new LatLng(
                  activity.startLocation?.latitude,
                  activity.startLocation?.longitude
                ),
              },
              {
                position: new LatLng(
                  activity.endLocation?.latitude,
                  activity.endLocation?.longitude
                ),
              },
            ]
          : activity.startLocation?.latitude
            ? [
                {
                  position: new LatLng(
                    activity.startLocation?.latitude,
                    activity.startLocation?.longitude
                  ),
                },
              ]
            : activity.endLocation?.latitude
              ? [
                  {
                    position: new LatLng(
                      activity.endLocation?.latitude,
                      activity.endLocation?.longitude
                    ),
                  },
                ]
              : null
      );

      this.activityForm.setValue({
        id: activity.id ?? '',
        title: activity.title ?? '',
        startDate: activity.startDate.toDate() ?? new Date(),
        endDate: activity.endDate.toDate() ?? new Date(),
        cost: activity.cost ?? 0,
        currency: activity.currency ?? 'ZAR',
        startLocation: activity.startLocation ?? null,
        endLocation: activity.endLocation ?? null,
        notes: activity.notes ?? '',
        tag: activity.tag ?? '',
      });
    }
  }

  @Output() outputActivity = new EventEmitter<ItineraryItem>();
  @Output() cancelClicked = new EventEmitter();

  @ViewChild('tagModal')
  tagModalRef: ElementRef<HTMLDialogElement> | null = null;
  @ViewChild('mapModal')
  mapModalRef: ElementRef<HTMLDialogElement> | null = null;

  locations = signal<LeafletPosition[] | null>(null);

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
    startLocation: new FormControl<GeoPoint | null>(null),
    endLocation: new FormControl<GeoPoint | null>(null),
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

  openMapModal() {
    this.mapModalRef?.nativeElement.showModal();
  }

  closeMapModal() {
    this.mapModalRef?.nativeElement.close();
  }

  clearForm() {
    const tempId = this.activityForm.value.id ?? '';
    this.activityForm.reset();
    this.activityForm.patchValue({
      id: tempId,
    });
  }

  locationsChanged(locations: LeafletPosition[]) {
    if (locations.length > 1) {
      this.activityForm.patchValue({
        startLocation: new GeoPoint(
          locations[0].position.lat,
          locations[0].position.lng
        ),
        endLocation: new GeoPoint(
          locations[1].position.lat,
          locations[1].position.lng
        ),
      });
    } else if (locations.length === 1) {
      this.activityForm.patchValue({
        startLocation: new GeoPoint(
          locations[0].position.lat,
          locations[0].position.lng
        ),
        endLocation: null,
      });
    } else {
      this.activityForm.patchValue({
        startLocation: null,
        endLocation: null,
      });
    }
  }

  cancelEdit() {
    this.cancelClicked.emit();
  }
}
