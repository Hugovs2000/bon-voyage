import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { ExchangeRatesDTO, Trip } from '../models/trips';
import { UserState } from '../store/user/reducer';
import { selectUserId } from '../store/user/selectors';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  userId = toSignal(this.userStore.select(selectUserId), { initialValue: '' });

  constructor(
    private firestore: Firestore,
    private http: HttpClient,
    private userStore: Store<UserState>
  ) {}

  getTrips() {
    return getDocs(
      query(
        collection(this.firestore, 'trips'),
        where('userId', '==', this.userId())
      )
    );
  }

  addTrip(trip: Trip) {
    return addDoc(collection(this.firestore, 'trips'), trip);
  }

  deleteTrip(tripId: string) {
    return deleteDoc(doc(this.firestore, 'trips', tripId));
  }

  updateTrip(tripId: string, trip: Trip) {
    return updateDoc(doc(this.firestore, 'trips', tripId), {
      ...trip,
    });
  }

  getCurrenciesFromApi(baseCurrency: string) {
    return this.http.get<ExchangeRatesDTO>(
      // Replace the URL with the actual API URL in the production code
      // `https://api.currencyapi.com/v3/latest?apikey=${environment.currencyApiKey}&currencies=EUR%2CUSD%2CGBP%2CAUD%2CZAR&base_currency=${baseCurrency}`
      `https://fakeUrl.com`
    );
  }

  getCurrenciesFromApiMock(baseCurrency: string) {
    switch (baseCurrency) {
      case 'USD':
        return this.http.get<ExchangeRatesDTO>(
          `assets/exchangeRates/exchangeRatesBaseUSD.json`
        );
      case 'GBP':
        return this.http.get<ExchangeRatesDTO>(
          `assets/exchangeRates/exchangeRatesBaseGBP.json`
        );
      case 'EUR':
        return this.http.get<ExchangeRatesDTO>(
          `assets/exchangeRates/exchangeRatesBaseEUR.json`
        );
      case 'AUD':
        return this.http.get<ExchangeRatesDTO>(
          `assets/exchangeRates/exchangeRatesBaseAUD.json`
        );
      default:
        return this.http.get<ExchangeRatesDTO>(
          `assets/exchangeRates/exchangeRatesBaseZAR.json`
        );
    }
  }
}
