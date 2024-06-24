import { createAction, props } from '@ngrx/store';
import { Trip } from '../../models/trips';

export const getAllTrips = createAction('[Trips] GetAllTrips');

export const getAllTripsComplete = createAction(
  '[Trips] GetAllTripsComplete',
  props<{ trips: Trip[] }>()
);

export const setSelectedTripId = createAction(
  '[Trips] SetSelectedTripId',
  props<{ tripId: string }>()
);

export const getTripById = createAction(
  '[Trips] GetTripById',
  props<{ tripId: string }>()
);

export const getTripByIdComplete = createAction(
  '[Trips] GetTripByIdComplete',
  props<{ trips: Trip }>()
);

export const createNewTrip = createAction(
  '[Trips] CreateNewTrip',
  props<{ trip: Trip }>()
);

export const createNewTripComplete = createAction(
  '[Trips] CreateNewTripComplete',
  props<{ trip: Trip }>()
);

export const updateTrip = createAction(
  '[Trips] UpdateTrip',
  props<{ tripId: string; trip: Trip }>()
);

export const updateTripComplete = createAction(
  '[Trips] UpdateTripComplete',
  props<{ trip: Trip }>()
);

export const deleteTrip = createAction(
  '[Trips] DeleteTrip',
  props<{ tripId: string }>()
);

export const deleteTripComplete = createAction('[Trips] DeleteTripComplete');
