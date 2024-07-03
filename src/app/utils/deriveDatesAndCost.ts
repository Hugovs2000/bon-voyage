import { ExchangeRatesDTO, Trip } from '../models/trips';

export const deriveDatesAndCost = (
  trip: Trip,
  exchangeRates?: ExchangeRatesDTO
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
        exchangeRates ?? undefined
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
  exchangeRates?: ExchangeRatesDTO
) => {
  switch (costCurrency) {
    case 'ZAR':
      let outputZAR = cost;
      if (exchangeRates?.data?.['ZAR'].value) {
        outputZAR = cost / exchangeRates.data['ZAR'].value;
      }
      return outputZAR;
    case 'USD':
      let outputUSD = cost;
      if (exchangeRates?.data?.['USD'].value) {
        outputUSD = cost / exchangeRates.data['USD'].value;
      }
      return outputUSD;
    case 'EUR':
      let outputEUR = cost;
      if (exchangeRates?.data?.['EUR'].value) {
        outputEUR = cost / exchangeRates.data['EUR'].value;
      }
      return outputEUR;
    case 'GBP':
      let outputGBP = cost;
      if (exchangeRates?.data?.['GBP'].value) {
        outputGBP = cost / exchangeRates.data['GBP'].value;
      }
      return outputGBP;
    case 'AUD':
      let outputAUD = cost;
      if (exchangeRates?.data?.['AUD'].value) {
        outputAUD = cost / exchangeRates.data['AUD'].value;
      }
      return outputAUD;
    default:
      return cost;
  }
};
