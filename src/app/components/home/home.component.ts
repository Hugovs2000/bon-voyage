import { CdkDragRelease, DragDropModule } from '@angular/cdk/drag-drop';
import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SwipeDirective } from '../../directives/swipe.directive';
import { getAllTrips, setSelectedTripId } from '../../store/trips/actions';
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

  constructor(
    private store: Store<TripState>,
    private router: Router
  ) {
    this.store.dispatch(getAllTrips());
  }

  resetPosition(event: CdkDragRelease) {
    event.source.reset();
  }

  handleTripClick(title: string, id: string) {
    this.store.dispatch(setSelectedTripId({ tripId: id }));
  }

  onSwipeRight(trip: string) {
    console.log('Edit', trip);
  }

  onSwipeLeft(trip: string) {
    console.log('Delete', trip);
  }

  handleAddTripClick() {
    this.router.navigate(['/new-trip']);
  }
}
