import { Trip } from '../models/trips';

export const deriveDatesAndCost = (trip: Trip) => {
  let startDate = new Date(8640000000000000);
  let endDate = new Date(-8640000000000000);
  let totalTripCost = 0;

  if (trip.itinerary && trip.itinerary.length > 0) {
    trip.itinerary.forEach(activity => {
      const newStartDate = activity.startDate.toDate();
      const newEndDate = activity.endDate.toDate();

      if (startDate && newStartDate && newStartDate < startDate) {
        startDate = newStartDate;
      }

      if (endDate && newEndDate && newEndDate > endDate) {
        endDate = newEndDate;
      }

      totalTripCost += activity.cost || 0;
    });
  }

  if (
    startDate >= new Date(864000000000000) ||
    endDate <= new Date(-864000000000000)
  ) {
    startDate = new Date();
    endDate = new Date();
    return {
      ...trip,
      startDate: startDate,
      endDate: endDate,
      duration: 1,
      totalCost: totalTripCost,
    } as Trip;
  }

  const duration = deriveDuration(startDate, endDate);

  return {
    ...trip,
    startDate: startDate,
    endDate: endDate,
    duration: duration,
    totalCost: totalTripCost,
  } as Trip;
};

export const deriveDuration = (startDate: Date, endDate: Date) => {
  return (
    Math.floor(
      Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1
  );
};
