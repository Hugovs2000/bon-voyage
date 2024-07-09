import { Component } from '@angular/core';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { RouterLink, RouterOutlet } from '@angular/router';

import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Store } from '@ngrx/store';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthService } from './services/auth.service';
import { getAllTrips, getExchangeRates } from './store/trips/actions';
import { TripState } from './store/trips/reducer';
import { logOut } from './store/user/actions';
import { UserState } from './store/user/reducer';
import { selectIsLoggedIn, selectUser } from './store/user/selectors';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    AngularFirestoreModule,
    LandingComponent,
    LoginComponent,
    SignupComponent,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    AsyncPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'bon-voyage';
  isLoggedIn$ = this.userStore.select(selectIsLoggedIn);

  constructor(
    private tripStore: Store<TripState>,
    private userStore: Store<UserState>,
    protected authService: AuthService
  ) {
    userStore
      .select(selectUser)
      .pipe(takeUntilDestroyed())
      .subscribe(user => {
        if (user.uid && user.baseCurrency) {
          this.tripStore.dispatch(
            getExchangeRates({ baseCurrency: user.baseCurrency })
          );
          this.tripStore.dispatch(getAllTrips());
        }
      });
  }

  signOut() {
    this.userStore.dispatch(logOut());
  }
}
