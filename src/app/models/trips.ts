export interface TripState {
  trips: Trip[];
  isLoading: boolean;
}

export interface Trip {
  id: number;
  userId: number;
  title: string;
  startDate: Date;
  endDate: Date;
  totalDuration: number;
  totalCost: number;
  itinerary?: ItineraryItem[];
}

export interface ItineraryItem {
  id: number;
  tripId: number;
  title: string;
  startDate: Date;
  endDate: Date;
  cost: number;
  currency: string;
  startLat: number;
  startLong: number;
  endLat: number;
  endLong: number;
  notes: string;
  tags?: Tag[];
}

export interface Tag {
  id: number;
  name: string;
}
