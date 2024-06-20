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
}
