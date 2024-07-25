import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { currencies } from '../../models/trips';
import { getExchangeRates } from '../../store/trips/actions';
import { TripState } from '../../store/trips/reducer';
import { setBaseCurrency } from '../../store/user/actions';
import { UserState } from '../../store/user/reducer';
import {
  selectBaseCurrency,
  selectIsLoggedIn,
} from '../../store/user/selectors';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
})
export class DrawerComponent {
  userStore = inject(Store<UserState>);
  tripStore = inject(Store<TripState>);
  isLoggedIn = toSignal(this.userStore.select(selectIsLoggedIn), {
    initialValue: false,
  });
  baseCurrency = toSignal(this.tripStore.select(selectBaseCurrency), {
    initialValue: 'ZAR',
  });
  currencies = currencies;

  setBaseCurrency(currency: string) {
    this.userStore.dispatch(setBaseCurrency({ baseCurrency: currency }));
    this.tripStore.dispatch(getExchangeRates());
  }
}
