import { Component } from '@angular/core';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { RouterLink, RouterOutlet } from '@angular/router';

import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Store } from '@ngrx/store';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { currencies } from './models/trips';
import { AuthService } from './services/auth.service';
import { getAllTrips, getExchangeRates } from './store/trips/actions';
import { TripState } from './store/trips/reducer';
import {
  getUserFromStorage,
  logOut,
  setBaseCurrency,
} from './store/user/actions';
import { UserState } from './store/user/reducer';
import { selectBaseCurrency, selectIsLoggedIn } from './store/user/selectors';

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
  isLoggedIn$ = this.userStore.select(selectIsLoggedIn);
  baseCurrency = toSignal(this.tripStore.select(selectBaseCurrency), {
    initialValue: 'ZAR',
  });

  currencies = currencies;

  constructor(
    private tripStore: Store<TripState>,
    private userStore: Store<UserState>,
    protected authService: AuthService
  ) {
    this.userStore.dispatch(getUserFromStorage());
    this.isLoggedIn$.pipe(takeUntilDestroyed()).subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.tripStore.dispatch(getExchangeRates());
        this.tripStore.dispatch(getAllTrips());
      }
    });
  }

  setBaseCurrency(currency: string) {
    this.userStore.dispatch(setBaseCurrency({ baseCurrency: currency }));
    this.tripStore.dispatch(getExchangeRates());
  }

  signOut() {
    this.userStore.dispatch(logOut());
  }
}
