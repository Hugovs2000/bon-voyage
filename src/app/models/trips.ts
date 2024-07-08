import { GeoPoint, Timestamp } from '@angular/fire/firestore';
import { LatLng } from 'leaflet';

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
  duration?: number;
  cost?: number;
  currency?: string;
  costInBaseCurrency?: number;
  startLocation?: GeoPoint;
  endLocation?: GeoPoint;
  notes?: string;
  tag: string;
}

export interface ExchangeRatesDTO {
  meta: Meta;
  data: CurrencySet;
}

export interface Meta {
  last_updated_at: string;
}

export interface CurrencySet {
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

export interface LeafletPosition {
  position: LatLng;
}
