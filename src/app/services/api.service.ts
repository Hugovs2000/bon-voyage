import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, catchError, retry } from 'rxjs';
import { Trip } from '../models/trips';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getTrips() {
    return this.http.get<Trip[]>('assets/trips.json').pipe(
      retry(2),
      catchError(error => {
        console.error('Error fetching trips', error);
        return EMPTY;
      })
    );
  }
}
