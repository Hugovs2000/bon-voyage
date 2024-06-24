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
            console.error(err);
            return getAllTripsComplete({ trips: [] });
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
            if (!data) {
              return createNewTripComplete({ trip: {} as Trip });
            }
            const trip = {
              ...action.trip,
              docId: data.id,
            };
            return createNewTripComplete({ trip: trip });
          })
          .catch(err => {
            console.error(err);
            return createNewTripComplete({ trip: {} as Trip });
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
            console.error(err);
            return updateTripComplete({ trip: {} as Trip });
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
            console.error(err);
            return deleteTripComplete({ tripId: action.tripId });
          })
      )
    )
  );

  constructor(
    private actions$: Actions,
    private apiService: ApiService
  ) {}
}
