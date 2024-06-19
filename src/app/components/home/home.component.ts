import { CdkDragRelease, DragDropModule } from '@angular/cdk/drag-drop';
import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, first } from 'rxjs';
import { SwipeDirective } from '../../directives/swipe.directive';
import { Trip } from '../../models/trips';
import { ApiService } from '../../services/api.service';
import { TripCardComponent } from '../trip-card/trip-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TripCardComponent, AsyncPipe, SwipeDirective, DragDropModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  trips$: Observable<Trip[]> | undefined;

  constructor(private apiService: ApiService) {
    this.trips$ = this.apiService.getTrips().pipe(first());
  }

  resetPosition(event: CdkDragRelease) {
    event.source.reset();
  }

  handleTripClick(trip: string) {
    console.log(`${trip} clicked`);
  }

  onSwipeRight(trip: string) {
    console.log('Edit', trip);
  }

  onSwipeLeft(trip: string) {
    console.log('Delete', trip);
  }
}
