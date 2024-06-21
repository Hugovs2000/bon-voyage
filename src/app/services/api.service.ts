import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private firestore: Firestore
  ) {}

  getTrips() {
    return getDocs(collection(this.firestore, 'trips'));
  }
}
