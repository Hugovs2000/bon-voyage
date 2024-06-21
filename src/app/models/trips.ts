export interface TripState {
  trips: Trip[];
  isLoading: boolean;
}

export interface Trip {
  docId: string;
  userId: string;
  title: string;
  itinerary?: ItineraryItem[];
}

export interface ItineraryItem {
  title: string;
  startDate: Date;
  endDate: Date;
  cost?: number;
  currency?: string;
  startLocation?: Location;
  endLocation?: Location;
  notes?: string;
  tags?: Tag[];
}

export interface Location {
  lat: number;
  long: number;
}

export interface Tag {
  name: string;
}
