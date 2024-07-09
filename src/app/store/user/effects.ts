import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import {
  logInComplete,
  logInError,
  logInWithEmail,
  logInWithGoogle,
  logOut,
  logOutComplete,
  signUserUp,
} from './actions';

@Injectable()
export class UserEffects {
  logUserInWithEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logInWithEmail),
      switchMap(action =>
        this.authService
          .login(action.email, action.password)
          .then(user => {
            const userObj = {
              displayName: user.user.displayName ?? null,
              email: user.user.email ?? null,
              phoneNumber: user.user.phoneNumber ?? null,
              photoURL: user.user.photoURL ?? null,
              uid: user.user.uid ?? null,
              baseCurrency: 'ZAR',
            };
            localStorage.setItem('user', JSON.stringify(userObj));
            this.router.navigate(['home']);
            return logInComplete({
              user: userObj,
            });
          })
          .catch(() => {
            this.snackBar.open(
              'Could not log in. Invalid user credentials.',
              'Close',
              {
                duration: 5000,
                panelClass: ['snackbar-error'],
              }
            );
            return logInError();
          })
      )
    )
  );

  logUserInWithGoogle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logInWithGoogle),
      switchMap(() =>
        this.authService
          .byGoogle()
          .then(user => {
            const userObj = {
              displayName: user.user.displayName ?? null,
              email: user.user.email ?? null,
              phoneNumber: user.user.phoneNumber ?? null,
              photoURL: user.user.photoURL ?? null,
              uid: user.user.uid ?? null,
              baseCurrency: 'ZAR',
            };
            localStorage.setItem('user', JSON.stringify(userObj));
            this.router.navigate(['home']);
            return logInComplete({
              user: userObj,
            });
          })
          .catch(() => {
            this.snackBar.open(
              'Could not log in. An error occurred. Please try again.',
              'Close',
              {
                duration: 5000,
                panelClass: ['snackbar-error'],
              }
            );
            return logInError();
          })
      )
    )
  );

  signUserUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signUserUp),
      switchMap(action =>
        this.authService
          .signup(action.email, action.password)
          .then(user => {
            const userObj = {
              displayName: user.user.displayName ?? null,
              email: user.user.email ?? null,
              phoneNumber: user.user.phoneNumber ?? null,
              photoURL: user.user.photoURL ?? null,
              uid: user.user.uid ?? null,
              baseCurrency: 'ZAR',
            };
            localStorage.setItem('user', JSON.stringify(userObj));
            this.router.navigate(['home']);
            return logInComplete({
              user: userObj,
            });
          })
          .catch(() => {
            this.snackBar.open(
              'Could not sign up. An error occurred. Please try again.',
              'Close',
              {
                duration: 5000,
                panelClass: ['snackbar-error'],
              }
            );
            return logInError();
          })
      )
    )
  );

  logUserOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logOut.type),
      switchMap(() =>
        this.authService
          .logUserOut()
          .then(() => {
            localStorage.removeItem('user');
            this.router.navigate(['']);
            return logOutComplete();
          })
          .catch(() => {
            this.snackBar.open(
              'There was a problem trying to log you out. Please try again.',
              'Close',
              {
                duration: 5000,
                panelClass: ['snackbar-error'],
              }
            );
            return logOutComplete();
          })
      )
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}
}
