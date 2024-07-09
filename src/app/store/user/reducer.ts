import { isDevMode } from '@angular/core';
import { ActionReducer, createReducer, MetaReducer, on } from '@ngrx/store';
import { logInComplete, logInError, logOutComplete } from './actions';

export const userFeatureKey = 'User';
const localUser = localStorage.getItem('user')?.valueOf();

export interface UserState {
  uid: string | null;
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
}

const initialState: UserState = localUser
  ? {
      uid: JSON.parse(localUser).uid,
      displayName: JSON.parse(localUser).displayName,
      email: JSON.parse(localUser).email,
      phoneNumber: JSON.parse(localUser).phoneNumber,
      photoURL: JSON.parse(localUser).photoURL,
    }
  : {
      uid: null,
      displayName: null,
      email: null,
      phoneNumber: null,
      photoURL: null,
    };

export const userReducers = createReducer(
  initialState,
  on(logInComplete, (_, { user }) => {
    return user;
  }),
  on(logInError, state => {
    return { ...state };
  }),
  on(logOutComplete, () => {
    return {
      uid: null,
      displayName: null,
      email: null,
      phoneNumber: null,
      photoURL: null,
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
