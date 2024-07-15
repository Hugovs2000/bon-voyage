import { CdkDragRelease, DragDropModule } from '@angular/cdk/drag-drop';
import { AsyncPipe } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { SwipeDirective } from '../../directives/swipe.directive';
import { deleteTrip, setSelectedTripId } from '../../store/trips/actions';
import { TripState } from '../../store/trips/reducer';
import {
  selectLoadingState,
  selectSelectedTrip,
  selectTrips,
} from '../../store/trips/selectors';
import { UserState } from '../../store/user/reducer';
import { selectBaseCurrency } from '../../store/user/selectors';
import { TripCardComponent } from '../trip-card/trip-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TripCardComponent,
    AsyncPipe,
    SwipeDirective,
    DragDropModule,
    MatProgressSpinnerModule,
    RouterLink,
    MatIconModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  tripStore = inject(Store<TripState>);
  userStore = inject(Store<UserState>);
  router = inject(Router);

  trips$ = this.tripStore.select(selectTrips);
  selectedTrip$ = this.tripStore.select(selectSelectedTrip);
  loading$ = this.tripStore.select(selectLoadingState);
  baseCurrency$ = this.userStore.select(selectBaseCurrency);

  selectedTripId = signal('');

  @ViewChild('confirmModal')
  modalRef: ElementRef<HTMLDialogElement> | null = null;

  resetPosition(event: CdkDragRelease) {
    event.source.reset();
  }

  closeModal() {
    this.selectedTripId.set('');
    this.modalRef?.nativeElement.close();
  }

  openModal() {
    this.modalRef?.nativeElement.showModal();
  }

  handleTripClick(id: string) {
    this.tripStore.dispatch(setSelectedTripId({ tripId: id }));
    this.router.navigate(['/trip', id]);
  }

  onSwipeRight(id: string) {
    this.tripStore.dispatch(setSelectedTripId({ tripId: id }));
    this.router.navigate(['/edit', id]);
  }

  onSwipeLeft(trip: string) {
    this.selectedTripId.set(trip);
    this.openModal();
  }

  deleteTrip() {
    if (this.selectedTripId() !== '') {
      this.tripStore.dispatch(deleteTrip({ tripId: this.selectedTripId() }));
      this.closeModal();
    }
  }
}
