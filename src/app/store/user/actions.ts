import { createAction, props } from '@ngrx/store';
import { UserState } from './reducer';

export const logInWithEmail = createAction(
  '[User] LogInWithEmail',
  props<{ email: string; password: string }>()
);

export const logInWithGoogle = createAction('[User] LogInWithGoogle');

export const signUserUp = createAction(
  '[User] SignUserUp',
  props<{ email: string; password: string }>()
);

export const logInComplete = createAction(
  '[User] LogInComplete',
  props<{ user: UserState }>()
);

export const logInError = createAction('[User] LogInError');

export const logOut = createAction('[User] LogOut');

export const logOutComplete = createAction('[User] LogOutComplete');