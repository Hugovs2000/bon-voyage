import { CdkDragRelease, DragDropModule } from '@angular/cdk/drag-drop';
import { NgOptimizedImage } from '@angular/common';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
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
    SwipeDirective,
    DragDropModule,
    RouterLink,
    MatIconModule,
    NgOptimizedImage,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  tripStore = inject(Store<TripState>);
  userStore = inject(Store<UserState>);
  router = inject(Router);

  trips = toSignal(this.tripStore.select(selectTrips), { initialValue: [] });
  selectedTrip = toSignal(this.tripStore.select(selectSelectedTrip), {
    initialValue: null,
  });
  loading = toSignal(this.tripStore.select(selectLoadingState), {
    initialValue: false,
  });
  baseCurrency = toSignal(this.userStore.select(selectBaseCurrency), {
    initialValue: 'ZAR',
  });

  @ViewChild('confirmModal')
  modalRef: ElementRef<HTMLDialogElement> | null = null;

  resetPosition(event: CdkDragRelease) {
    event.source.reset();
  }

  closeModal() {
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

  onSwipeLeft(id: string) {
    this.tripStore.dispatch(setSelectedTripId({ tripId: id }));
    this.openModal();
  }

  deleteTrip() {
    if (this.selectedTrip() !== null) {
      this.tripStore.dispatch(
        deleteTrip({ tripId: this.selectedTrip()?.docId ?? '' })
      );
      this.closeModal();
    }
  }
}
