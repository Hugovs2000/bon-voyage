import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Trip, TripState } from '../../models/trips';
import { tripsFeatureKey } from './reducer';

export const selectFeature = createFeatureSelector<TripState>(tripsFeatureKey);

export const selectTrips = createSelector(selectFeature, state => {
  const updatedTrips = state.trips.map(trip => {
    const startDates: Date[] = [];
    const endDates: Date[] = [];
    let totalTripCost = 0;

    if (trip.itinerary && trip.itinerary.length > 0) {
      trip.itinerary.forEach(activity => {
        const newStartDate = activity.startDate.toDate();
        const newEndDate = activity.endDate.toDate();

        startDates.push(newStartDate);
        endDates.push(newEndDate);
        totalTripCost += activity.cost || 0;
      });
    }

    startDates.sort((a, b) => a.getDate() - b.getDate());
    endDates.sort((a, b) => a.getDate() - b.getDate());
    console.log('startDates', startDates);
    console.log('endDates', endDates);
    const duration =
      endDates[endDates.length - 1].getDate() - startDates[0].getDate() + 1;

    return {
      ...trip,
      startDate: startDates[0],
      endDate: endDates[endDates.length - 1],
      duration: duration,
      totalCost: totalTripCost,
    } as unknown as Trip;
  });
  return {
    trips: updatedTrips,
    isLoading: state.isLoading,
  } as TripState;
});
