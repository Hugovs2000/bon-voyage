import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Timestamp } from '@angular/fire/firestore';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ItineraryItem, Trip } from '../../models/trips';
import { AuthService } from '../../services/auth.service';
import {
  createNewTrip,
  setSelectedTripId,
  updateTrip,
} from '../../store/trips/actions';
import { TripState } from '../../store/trips/reducer';
import {
  selectLoadingState,
  selectSelectedTrip,
} from '../../store/trips/selectors';
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
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './alter-trip.component.html',
  styleUrl: './alter-trip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlterTripComponent implements OnInit {
  @Input() set id(id: string) {
    if (id) {
      this.store.dispatch(setSelectedTripId({ tripId: id }));
    } else {
      this.store.dispatch(setSelectedTripId({ tripId: '' }));
    }
  }

  @ViewChild('confirmModal')
  confirmModal: ElementRef<HTMLDialogElement> | null = null;

  selectedTrip = signal<Trip | null>(null);
  activityToDelete = signal<ItineraryItem | null>(null);
  activityToEdit = signal<ItineraryItem | null>(null);

  private destroyRef = inject(DestroyRef);
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

  ngOnInit() {
    this.store
      .select(selectSelectedTrip)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(trip => {
        if (trip) {
          this.selectedTrip.set(trip);
          this.tripForm.setValue({
            title: trip.title,
            userId: trip.userId,
          });
          this.itinerary = Array.isArray(trip.itinerary)
            ? [...trip.itinerary]
            : ([] as ItineraryItem[]);
        }
      });
  }

  addActivity(activity: ItineraryItem) {
    if (activity.startDate instanceof Date) {
      activity.startDate = Timestamp.fromDate(activity.startDate);
    }
    if (activity.endDate instanceof Date) {
      activity.endDate = Timestamp.fromDate(activity.endDate);
    }

    this.itinerary.push(activity);
  }

  removeActivity(activity: ItineraryItem | null) {
    this.confirmModal?.nativeElement.close();
    this.itinerary = this.itinerary.filter(act => act.id !== activity?.id);
  }

  setActivityToEdit(activity: ItineraryItem) {
    this.activityToEdit.set(activity);
  }

  updateActivity(activity: ItineraryItem) {
    this.removeActivity(activity);
    this.addActivity(activity);
    this.activityToEdit.set(null);
  }

  cancelEdit() {
    this.activityToEdit.set(null);
  }

  openConfirmModal(activity: ItineraryItem) {
    this.confirmModal?.nativeElement.showModal();
    this.activityToDelete.set(activity);
  }

  confirmDelete() {
    this.removeActivity(this.activityToDelete());
    this.activityToDelete.set(null);
  }

  closeConfirmModal() {
    this.confirmModal?.nativeElement.close();
    this.activityToDelete.set(null);
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
      if (this.selectedTrip()?.docId && this.selectedTrip()?.docId !== '') {
        const trip = {
          ...this.tripForm.value,
          itinerary: this.itinerary,
          docId: this.selectedTrip()?.docId,
        } as Trip;

        this.store.dispatch(updateTrip({ trip }));
      } else {
        const trip = {
          ...this.tripForm.value,
          itinerary: this.itinerary,
        } as Trip;

        this.store.dispatch(createNewTrip({ trip }));
      }
    }
  }
}
