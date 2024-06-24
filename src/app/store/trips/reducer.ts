import { isDevMode } from '@angular/core';
import { createReducer, MetaReducer, on } from '@ngrx/store';
import { Trip } from '../../models/trips';
import {
  createNewTrip,
  createNewTripComplete,
  createNewTripError,
  deleteTrip,
  deleteTripComplete,
  deleteTripError,
  getAllTrips,
  getAllTripsComplete,
  getAllTripsError,
  setSelectedTripId,
  updateTrip,
  updateTripComplete,
  updateTripError,
} from './actions';

export const tripsFeatureKey = 'Trips';

export interface TripState {
  trips: Trip[];
  isLoading: boolean;
  selectedTripId?: string;
}

const initialState: TripState = {
  trips: [],
  isLoading: false,
};

export const tripsReducers = createReducer(
  initialState,
  on(getAllTrips, state => ({
    ...state,
    isLoading: true,
  })),
  on(getAllTripsComplete, (state, { trips }) => ({
    ...state,
    isLoading: false,
    trips,
  })),
  on(getAllTripsError, (state, { error }) => {
    alert(`Error getting trips. Error message: ${error.message}`);
    return {
      ...state,
      isLoading: false,
    };
  }),
  on(createNewTrip, state => ({
    ...state,
    isLoading: true,
  })),
  on(createNewTripComplete, (state, { trip }) => ({
    ...state,
    isLoading: false,
    trips: [...state.trips, trip],
  })),
  on(createNewTripError, (state, { error }) => {
    alert(`Error creating new trip. Error message: ${error.message}`);
    return {
      ...state,
      isLoading: false,
    };
  }),
  on(updateTrip, state => ({
    ...state,
    isLoading: true,
  })),
  on(updateTripComplete, (state, { trip }) => ({
    ...state,
    isLoading: false,
    trips: [...state.trips, trip],
  })),
  on(updateTripError, (state, { error }) => {
    alert(`Error updating trip. Error message: ${error.message}`);
    return {
      ...state,
      isLoading: false,
    };
  }),
  on(deleteTrip, state => ({
    ...state,
    isLoading: true,
  })),
  on(deleteTripComplete, (state, { tripId }) => ({
    ...state,
    isLoading: false,
    trips: state.trips.filter(t => t.docId !== tripId),
  })),
  on(deleteTripError, (state, { error }) => {
    alert(`Error deleting trip. Error message: ${error.message}`);
    return {
      ...state,
      isLoading: false,
    };
  }),
  on(setSelectedTripId, (state, { tripId }) => ({
    ...state,
    selectedTripId: tripId,
  }))
);

export const metaReducers: MetaReducer<Trip>[] = isDevMode() ? [] : [];
