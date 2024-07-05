import { ExchangeRatesDTO, ItineraryItem, Trip } from '../models/trips';

export const deriveDatesAndCost = (
  trip: Trip,
  exchangeRates: ExchangeRatesDTO | null
) => {
  let startDate = new Date(8640000000000000);
  let endDate = new Date(-8640000000000000);
  let totalTripCost = 0;
  const updatedActivities: ItineraryItem[] = [];

  if (trip.itinerary && trip.itinerary.length > 0) {
    trip.itinerary.map(activity => {
      const newStartDate = activity.startDate.toDate();
      const newEndDate = activity.endDate.toDate();

      if (startDate && newStartDate && newStartDate < startDate) {
        startDate = newStartDate;
      }

      if (endDate && newEndDate && newEndDate > endDate) {
        endDate = newEndDate;
      }

      const costInBaseCurrency = exchange(
        activity.currency ?? 'ZAR',
        activity.cost ?? 0,
        exchangeRates
      );

      totalTripCost += costInBaseCurrency;

      updatedActivities.push({
        ...activity,
        duration: deriveDuration(newStartDate, newEndDate),
        costInBaseCurrency: costInBaseCurrency,
      });
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
      itinerary: updatedActivities,
      startDate: startDate,
      endDate: endDate,
      duration: 1,
      totalCost: totalTripCost,
    } as Trip;
  }

  const duration = deriveDuration(startDate, endDate);

  return {
    ...trip,
    itinerary: updatedActivities,
    startDate: startDate,
    endDate: endDate,
    duration: duration,
    totalCost: totalTripCost,
  } as Trip;
};

export const deriveDuration = (startDate: Date, endDate: Date) => {
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
  return (
    Math.ceil(
      Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1
  );
};

export const exchange = (
  costCurrency: string,
  cost: number,
  exchangeRates: ExchangeRatesDTO | null
) => {
  let outputCost = cost;
  switch (costCurrency) {
    case 'ZAR':
      if (exchangeRates?.data?.['ZAR'].value) {
        outputCost = cost / exchangeRates.data['ZAR'].value;
      }
      return outputCost;
    case 'USD':
      if (exchangeRates?.data?.['USD'].value) {
        outputCost = cost / exchangeRates.data['USD'].value;
      }
      return outputCost;
    case 'EUR':
      if (exchangeRates?.data?.['EUR'].value) {
        outputCost = cost / exchangeRates.data['EUR'].value;
      }
      return outputCost;
    case 'GBP':
      if (exchangeRates?.data?.['GBP'].value) {
        outputCost = cost / exchangeRates.data['GBP'].value;
      }
      return outputCost;
    case 'AUD':
      if (exchangeRates?.data?.['AUD'].value) {
        outputCost = cost / exchangeRates.data['AUD'].value;
      }
      return outputCost;
    default:
      return outputCost;
  }
};
