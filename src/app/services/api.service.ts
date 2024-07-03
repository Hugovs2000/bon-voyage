import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';
import { ExchangeRates, Trip } from '../models/trips';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private firestore: Firestore,
    private http: HttpClient
  ) {}

  getTrips() {
    return getDocs(collection(this.firestore, 'trips'));
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

  getCurrencies(baseCurrency: string) {
    switch (baseCurrency) {
      case 'USD':
        return this.http.get<ExchangeRates>(`assets/exchangeRatesBaseUSD.json`);
      case 'GBP':
        return this.http.get<ExchangeRates>(`assets/exchangeRatesBaseGBP.json`);
      case 'EUR':
        return this.http.get<ExchangeRates>(`assets/exchangeRatesBaseEUR.json`);
      case 'AUD':
        return this.http.get<ExchangeRates>(`assets/exchangeRatesBaseAUD.json`);
      default:
        return this.http.get<ExchangeRates>(`assets/exchangeRatesBaseZAR.json`);
    }
    // Replace the switch statement with the following code in prod:
    // return this.http.get<ExchangeRates>(
    //   `https://api.currencyapi.com/v3/latest?apikey=${environment.currencyApiKey}&currencies=EUR%2CUSD%2CGBP%2CAUD%2CZAR&base_currency=${baseCurrency}`
    // );
  }
}
