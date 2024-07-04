import { createFeatureSelector, createSelector } from '@ngrx/store';
import { deriveDatesAndCost } from '../../utils/deriveDatesAndCost';
import { TripState, tripsFeatureKey } from './reducer';

export const selectFeature = createFeatureSelector<TripState>(tripsFeatureKey);

export const selectTrips = createSelector(selectFeature, state => {
  const trips = state.trips.map(trip => {
    return deriveDatesAndCost(trip, state.exchangeRates ?? null);
  });
  return trips;
});

export const selectSelectedTrip = createSelector(selectFeature, state => {
  const trip = state.trips.find(trip => trip.docId === state.selectedTripId);
  return trip ? deriveDatesAndCost(trip, state.exchangeRates ?? null) : null;
});

export const selectLoadingState = createSelector(
  selectFeature,
  state => state.isLoading
);

export const selectBaseCurrency = createSelector(selectFeature, state => {
  return state.baseCurrency ?? 'ZAR';
});

export const selectExchangeRates = createSelector(
  selectFeature,
  state => state.exchangeRates
);
