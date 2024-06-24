import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Trip } from '../../models/trips';
import { TripState, tripsFeatureKey } from './reducer';

export const selectFeature = createFeatureSelector<TripState>(tripsFeatureKey);

export const selectTrips = createSelector(selectFeature, state => {
  const updatedTrips = state.trips.map(trip => {
    let startDate = new Date(8640000000000000);
    let endDate = new Date(-8640000000000000);
    let totalTripCost = 0;

    if (trip.itinerary && trip.itinerary.length > 0) {
      trip.itinerary.forEach(activity => {
        const newStartDate = activity.startDate.toDate();
        const newEndDate = activity.endDate.toDate();

        startDate = startDate
          ? newStartDate < startDate
            ? newStartDate
            : startDate
          : newStartDate;
        endDate = endDate
          ? newEndDate > endDate
            ? newEndDate
            : endDate
          : newEndDate;
        totalTripCost += activity.cost || 0;
      });
    }

    if (
      startDate === new Date(8640000000000000) ||
      endDate === new Date(-8640000000000000)
    ) {
      return {
        ...trip,
        totalCost: totalTripCost,
      } as Trip;
    }

    const duration = endDate.getDate() - startDate.getDate() + 1;

    return {
      ...trip,
      startDate: startDate,
      endDate: endDate,
      duration: duration,
      totalCost: totalTripCost,
    } as Trip;
  });
  return {
    trips: updatedTrips,
    isLoading: state.isLoading,
  } as TripState;
});

export const selectSelectedTrip = createSelector(selectFeature, state =>
  state.trips.find(trip => trip.docId === state.selectedTripId)
);
