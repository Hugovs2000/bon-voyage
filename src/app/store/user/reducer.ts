import { isDevMode } from '@angular/core';
import { ActionReducer, createReducer, MetaReducer, on } from '@ngrx/store';
import {
  logInComplete,
  logInError,
  logOutComplete,
  setBaseCurrency,
} from './actions';

export const userFeatureKey = 'User';

export interface UserState {
  uid: string | null;
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  baseCurrency: string;
}

const initialState: UserState = {
  uid: null,
  displayName: null,
  email: null,
  phoneNumber: null,
  photoURL: null,
  baseCurrency: 'ZAR',
};

export const userReducers = createReducer(
  initialState,
  on(logInComplete, (_, { user }) => {
    return user;
  }),
  on(logInError, state => state),
  on(logOutComplete, () => {
    return {
      uid: null,
      displayName: null,
      email: null,
      phoneNumber: null,
      photoURL: null,
      baseCurrency: 'ZAR',
    };
  }),
  on(setBaseCurrency, (state, { baseCurrency }) => {
    return { ...state, baseCurrency };
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
