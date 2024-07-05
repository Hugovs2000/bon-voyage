import { ExchangeRatesDTO, Trip } from '../models/trips';

export const deriveDatesAndCost = (
  trip: Trip,
  exchangeRates: ExchangeRatesDTO | null
) => {
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

      totalTripCost += exchange(
        activity.currency ?? 'ZAR',
        activity.cost ?? 0,
        exchangeRates
      );
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
