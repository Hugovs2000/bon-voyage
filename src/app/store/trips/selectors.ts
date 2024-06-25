import { createFeatureSelector, createSelector } from '@ngrx/store';
import { deriveDatesAndCost } from '../../utils/deriveDatesAndCost';
import { TripState, tripsFeatureKey } from './reducer';

export const selectFeature = createFeatureSelector<TripState>(tripsFeatureKey);

export const selectTrips = createSelector(selectFeature, state => {
  const trips = state.trips.map(trip => {
    return deriveDatesAndCost(trip);
  });
  return trips;
});

export const selectSelectedTrip = createSelector(selectFeature, state => {
  const trip = state.trips.find(trip => trip.docId === state.selectedTripId);
  return trip ? deriveDatesAndCost(trip) : null;
});
