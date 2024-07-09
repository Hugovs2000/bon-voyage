import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState, userFeatureKey } from './reducer';

export const selectFeature = createFeatureSelector<UserState>(userFeatureKey);

export const selectUser = createSelector(selectFeature, state => {
  if (localStorage.getItem('user'))
    return JSON.parse(localStorage.getItem('user')?.valueOf() ?? '');
  return state;
});

export const selectIsLoggedIn = createSelector(selectFeature, state => {
  if (localStorage.getItem('user')) {
    return true;
  } else if (state.uid) {
    return true;
  } else {
    return false;
  }
});

export const selectBaseCurrency = createSelector(selectFeature, state => {
  return state.baseCurrency;
});
