import { createAction, props } from '@ngrx/store';
import { Trip } from '../../models/trips';

export const getAllTrips = createAction('[Trips] GetAllTrips');

export const getAllTripsComplete = createAction(
  '[Trips] GetAllTripsComplete',
  props<{ trips: Trip[] }>()
);

export const getTripById = createAction('[Trips] GetTripById');

export const getTripByIdComplete = createAction(
  '[Trips] GetTripByIdComplete',
  props<{ trips: Trip }>()
);
