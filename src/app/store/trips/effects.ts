import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { switchMap } from 'rxjs';
import { Trip } from '../../models/trips';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import {
  createNewTrip,
  createNewTripComplete,
  deleteTrip,
  deleteTripComplete,
  getAllTrips,
  getAllTripsComplete,
  setLoadingState,
  updateTrip,
  updateTripComplete,
} from './actions';

@Injectable()
export class TripsEffects {
  getAllTrips$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getAllTrips.type),
      switchMap(() =>
        this.apiService
          .getTrips()
          .then(data => {
            if (data.empty) {
              return getAllTripsComplete({ trips: [] });
            }
            const trips = data.docs
              .filter(
                doc => (doc.data() as Trip).userId === this.authService.userId
              )
              .map(doc => {
                return {
                  ...(doc.data() as Trip),
                  docId: doc.id,
                };
              });
            return getAllTripsComplete({ trips: trips });
          })
          .catch(err => {
            alert('Apologies, could not retrieve trips.');
            return setLoadingState({ isLoading: false });
          })
      )
    )
  );

  createNewTrip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createNewTrip.type),
      switchMap((action: { type: string; trip: Trip }) =>
        this.apiService
          .addTrip(action.trip)
          .then(data => {
            if (!data.id) {
              alert('Apologies, could not save new trip. Please try again.');
              return setLoadingState({ isLoading: false });
            }
            const trip = {
              ...action.trip,
              docId: data.id,
            };
            return createNewTripComplete({ trip: trip });
          })
          .catch(err => {
            alert('Apologies, could not save new trip. Please try again.');
            return setLoadingState({ isLoading: false });
          })
      )
    )
  );

  updateTrip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTrip.type),
      switchMap((action: { type: string; trip: Trip }) =>
        this.apiService
          .updateTrip(action.trip.docId, action.trip)
          .then(() => {
            return updateTripComplete({ trip: action.trip });
          })
          .catch(err => {
            alert('Apologies, could not update trip. Please try again.');
            return setLoadingState({ isLoading: false });
          })
      )
    )
  );

  deleteTrip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteTrip.type),
      switchMap((action: { type: string; tripId: string }) =>
        this.apiService
          .deleteTrip(action.tripId)
          .then(() => {
            return deleteTripComplete({ tripId: action.tripId });
          })
          .catch(err => {
            alert(`There was a problem deleting the trip. Please try again`);
            return setLoadingState({ isLoading: false });
          })
      )
    )
  );

  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private authService: AuthService
  ) {}
}
