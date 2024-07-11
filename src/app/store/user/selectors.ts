import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState, userFeatureKey } from './reducer';

export const selectFeature = createFeatureSelector<UserState>(userFeatureKey);

export const selectUser = createSelector(selectFeature, state => {
  return state;
});

export const selectIsLoggedIn = createSelector(selectFeature, state => {
  if (!state.uid) {
    return false;
  }
  return true;
});

export const selectBaseCurrency = createSelector(selectFeature, state => {
  return state.baseCurrency;
});
