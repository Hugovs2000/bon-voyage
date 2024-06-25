import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { switchMap } from 'rxjs';
import { Trip } from '../../models/trips';
import { ApiService } from '../../services/api.service';
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
            const trips = data.docs.map(doc => {
              return {
                ...(doc.data() as Trip),
                docId: doc.id,
              };
            });
            return getAllTripsComplete({ trips: trips });
          })
          .catch(err => {
            alert(`Error getting trips. Error message: ${err.message}`);
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
              return createNewTripComplete({ trip: {} as Trip });
            }
            const trip = {
              ...action.trip,
              docId: data.id,
            };
            return createNewTripComplete({ trip: trip });
          })
          .catch(err => {
            alert(`Error creating new trip. Error message: ${err.message}`);
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
            alert(`Error updating trip. Error message: ${err.message}`);
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
            alert(`Error deleting trip. Error message: ${err.message}`);
            return setLoadingState({ isLoading: false });
          })
      )
    )
  );

  constructor(
    private actions$: Actions,
    private apiService: ApiService
  ) {}
}
