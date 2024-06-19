import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, first } from 'rxjs';
import { Trip } from '../../models/trips';
import { ApiService } from '../../services/api.service';
import { TripCardComponent } from '../trip-card/trip-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TripCardComponent, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  trips$: Observable<Trip[]> | undefined;

  constructor(private apiService: ApiService) {
    this.trips$ = this.apiService.getTrips().pipe(first());
  }

  handleTripClick(trip: string) {
    console.log(`${trip} clicked`);
  }
}
