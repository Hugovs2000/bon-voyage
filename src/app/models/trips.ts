import { GeoPoint, Timestamp } from '@angular/fire/firestore';

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
  id?: string;
  title: string;
  startDate: Timestamp;
  endDate: Timestamp;
  cost?: number;
  currency?: string;
  startLocation?: GeoPoint;
  endLocation?: GeoPoint;
  notes?: string;
  tag: string;
}

export interface ExchangeRates {
  meta: Meta;
  data: Data;
}

export interface Meta {
  last_updated_at: string;
}

export interface Data {
  [key: string]: Currency;
}

export interface Currency {
  code: string;
  value: number;
}

export const currencies = [
  { value: 'ZAR' },
  { value: 'GBP' },
  { value: 'USD' },
  { value: 'EUR' },
  { value: 'AUD' },
];
