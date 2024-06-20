import { isDevMode } from '@angular/core';
import { createReducer, MetaReducer, on } from '@ngrx/store';
import { Trip, TripState } from '../../models/trips';
import { getAllTripsComplete } from './actions';

export const tripsFeatureKey = 'Trips';

const initialState: TripState = {
  trips: [],
  isLoading: false,
};

export const tripsReducers = createReducer(
  initialState,
  on(getAllTripsComplete, (state, { trips }) => ({
    ...state,
    trips,
  }))
);

export const metaReducers: MetaReducer<Trip>[] = isDevMode() ? [] : [];
