import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { DrawerComponent } from './components/drawer/drawer.component';
import { NavComponent } from './components/nav/nav.component';
import { AuthService } from './services/auth.service';
import { getAllTrips, getExchangeRates } from './store/trips/actions';
import { TripState } from './store/trips/reducer';
import { getUserFromStorage } from './store/user/actions';
import { UserState } from './store/user/reducer';
import { selectIsLoggedIn } from './store/user/selectors';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, DrawerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isLoggedIn$ = this.userStore.select(selectIsLoggedIn);

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
}
