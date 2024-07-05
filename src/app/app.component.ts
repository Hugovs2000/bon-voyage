import { Component } from '@angular/core';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

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
import { selectBaseCurrency } from './store/trips/selectors';

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
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'bon-voyage';

  constructor(
    private store: Store<TripState>,
    private router: Router,
    protected authService: AuthService
  ) {
    this.store
      .select(selectBaseCurrency)
      .pipe(takeUntilDestroyed())
      .subscribe(baseCurrency => {
        this.store.dispatch(
          getExchangeRates({ baseCurrency: baseCurrency ?? 'ZAR' })
        );
      });
    this.store.dispatch(getAllTrips());
  }

  signOut() {
    this.authService.logUserOut();
    this.router.navigate(['']);
  }
}
