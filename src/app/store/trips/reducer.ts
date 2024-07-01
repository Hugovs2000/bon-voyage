import { isDevMode } from '@angular/core';
import { ActionReducer, createReducer, MetaReducer, on } from '@ngrx/store';
import { Trip } from '../../models/trips';
import {
  createNewTrip,
  createNewTripComplete,
  deleteTrip,
  deleteTripComplete,
  getAllTrips,
  getAllTripsComplete,
  setLoadingState,
  setSelectedTripId,
  updateTrip,
  updateTripComplete,
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
  on(createNewTrip, state => ({
    ...state,
    isLoading: true,
  })),
  on(createNewTripComplete, (state, { trip }) => ({
    ...state,
    isLoading: false,
    trips: [...state.trips, trip],
    selectedTripId: trip.docId,
  })),
  on(updateTrip, state => ({
    ...state,
    isLoading: true,
  })),
  on(updateTripComplete, (state, { trip }) => ({
    ...state,
    isLoading: false,
    trips: state.trips.map(t => (t.docId === trip.docId ? trip : t)),
  })),
  on(deleteTrip, state => ({
    ...state,
    isLoading: true,
  })),
  on(deleteTripComplete, (state, { tripId }) => ({
    ...state,
    isLoading: false,
    trips: state.trips.filter(t => t.docId !== tripId),
  })),
  on(setSelectedTripId, (state, { tripId }) => ({
    ...state,
    selectedTripId: tripId,
  })),
  on(setLoadingState, (state, { isLoading }) => {
    return {
      ...state,
      isLoading: isLoading,
    };
  })
);

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state, action) {
    console.log('action', action);
    console.log('state', reducer(state, action));

    return reducer(state, action);
  };
}
export const metaReducers: MetaReducer[] = isDevMode() ? [debug] : [];
