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
import { Trip } from '../models/trips';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private firestore: Firestore) {}

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
}
