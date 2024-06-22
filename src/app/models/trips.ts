import { GeoPoint, Timestamp } from '@angular/fire/firestore';

export interface TripState {
  trips: Trip[];
  isLoading: boolean;
}

export interface Trip {
  docId: string;
  userId: string;
  title: string;
  startDate?: Date;
  endDate?: Date;
  duration?: number;
  totalCost?: number;
  itinerary?: ItineraryItem[];
}

export interface ItineraryItem {
  title: string;
  startDate: Timestamp;
  endDate: Timestamp;
  cost?: number;
  currency?: string;
  startLocation?: GeoPoint;
  endLocation?: GeoPoint;
  notes?: string;
  tags?: Tag[];
}

export interface Tag {
  name: string;
}
