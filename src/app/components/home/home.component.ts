import { CdkDragRelease, DragDropModule } from '@angular/cdk/drag-drop';
import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SwipeDirective } from '../../directives/swipe.directive';
import {
  deleteTrip,
  getAllTrips,
  setSelectedTripId,
} from '../../store/trips/actions';
import { TripState } from '../../store/trips/reducer';
import {
  selectLoadingState,
  selectSelectedTrip,
  selectTrips,
} from '../../store/trips/selectors';
import { TripCardComponent } from '../trip-card/trip-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TripCardComponent, AsyncPipe, SwipeDirective, DragDropModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  trips$ = this.store.select(selectTrips);
  selectedTrip$ = this.store.select(selectSelectedTrip);
  loading$ = this.store.select(selectLoadingState);

  selectedTripId = signal('');

  @ViewChild('confirmModal')
  modalRef: ElementRef<HTMLDialogElement> | null = null;

  constructor(
    private store: Store<TripState>,
    private router: Router
  ) {
    this.store.dispatch(getAllTrips());
  }

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
    this.store.dispatch(setSelectedTripId({ tripId: id }));
    this.router.navigate(['/trip', id]);
  }

  onSwipeRight(trip: string) {
    console.log('Edit', trip);
  }

  onSwipeLeft(trip: string) {
    this.selectedTripId.set(trip);
    this.openModal();
  }

  deleteTrip() {
    if (this.selectedTripId() !== '') {
      this.store.dispatch(deleteTrip({ tripId: this.selectedTripId() }));
      this.closeModal();
    }
  }

  handleAddTripClick() {
    this.router.navigate(['/new-trip']);
  }
}
