import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { switchMap } from 'rxjs';
import { Trip } from '../../models/trips';
import { ApiService } from '../../services/api.service';
import { getAllTrips, getAllTripsComplete } from './actions';

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
              doc.data() as Trip;
              return { ...(doc.data() as Trip), docId: doc.id };
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

  // TODO: Implement the rest of the effects
  // getTripById$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(getTripById.type),
  //     switchMap(() =>
  //       this.apiService.getTripById().pipe(
  //         map(trip => getTripByIdComplete({ trip })),
  //         retry(1),
  //         catchError(err => {
  //           console.error(err);
  //           return EMPTY;
  //         })
  //       )
  //     )
  //   )
  // );

  // createNewTrip$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(createNewTrip.type),
  //     switchMap(() =>
  //       this.apiService.addTrip().pipe(
  //         map(trip => createNewTripComplete({ trip })),
  //         retry(1),
  //         catchError(err => {
  //           console.error(err);
  //           return EMPTY;
  //         })
  //       )
  //     )
  //   )
  // );

  // updateTrip$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(updateTrip.type),
  //     switchMap(() =>
  //       this.apiService.updateTrip().pipe(
  //         map(trip => updateTripComplete({ trip })),
  //         retry(1),
  //         catchError(err => {
  //           console.error(err);
  //           return EMPTY;
  //         })
  //       )
  //     )
  //   )
  // );

  // deleteTrip$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(deleteTrip.type),
  //     switchMap(() =>
  //       this.apiService.deleteTrip().pipe(
  //         map(trip => deleteTripComplete()),
  //         retry(1),
  //         catchError(err => {
  //           console.error(err);
  //           return EMPTY;
  //         })
  //       )
  //     )
  //   )
  // );

  constructor(
    private actions$: Actions,
    private apiService: ApiService
  ) {}
}
