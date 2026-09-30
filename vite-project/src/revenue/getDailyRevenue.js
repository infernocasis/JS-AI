import { calculateDailyRevenue } from "./calculateDailyRevenue.js";
import { convertRevenue } from "./convertRevenue.js";

/** Все три запроса идут параллельно: оба источника и курсы */
export async function getDailyRevenue({
  financeApi,
  exchangeRatesApi,
  targetCurrency,
}) {
  const [orderData, cashPayments, exchangeRates] = await Promise.all([
    financeApi.getTransactions(),
    financeApi.getCashPayments(),
    exchangeRatesApi.getLatestRates(),
  ]);

  const totalsByCurrency = calculateDailyRevenue(orderData, cashPayments);
  const result = convertRevenue(
    totalsByCurrency,
    exchangeRates,
    targetCurrency,
  );

  return { ...result, ratesDate: exchangeRates.date };
}
