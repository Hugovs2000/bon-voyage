import { isDevMode } from '@angular/core';
import { createReducer, MetaReducer, on } from '@ngrx/store';
import { Trip } from '../../models/trips';
import { getAllTrips, getAllTripsComplete, setSelectedTripId } from './actions';

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
  on(setSelectedTripId, (state, { tripId }) => ({
    ...state,
    selectedTripId: tripId,
  }))
);

export const metaReducers: MetaReducer<Trip>[] = isDevMode() ? [] : [];
