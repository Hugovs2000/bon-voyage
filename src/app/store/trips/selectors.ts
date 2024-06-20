import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TripState } from '../../models/trips';
import { tripsFeatureKey } from './reducer';

export const selectFeature = createFeatureSelector<TripState>(tripsFeatureKey);

export const selectTrips = createSelector(
  selectFeature,
  (state: TripState) => state
);
