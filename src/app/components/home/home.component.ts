import { CdkDragRelease, DragDropModule } from '@angular/cdk/drag-drop';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { first } from 'rxjs';
import { SwipeDirective } from '../../directives/swipe.directive';
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
  apiService = inject(ApiService);
  trips$ = this.apiService.getTrips().pipe(first());

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
