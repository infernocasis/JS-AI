import { convertCents, toCents, fromCents } from "../money/index.js";

/**
 * Чистая функция: [{ total, currency }, ...] + курсы -> итог в целевой валюте.
 * Сначала суммируем внутри каждой валюты, потом конвертируем один раз —
 * меньше ошибок округления, чем при конвертации каждого платежа.
 */
export function convertRevenue(
  totalsByCurrency,
  exchangeRates,
  targetCurrency,
) {
  const breakdown = totalsByCurrency.map(({ total, currency }) => {
    const convertedCents = convertCents(
      toCents(total),
      currency,
      targetCurrency,
      exchangeRates,
    );
    return { currency, total, convertedCents };
  });

  const totalCents = breakdown.reduce(
    (sum, item) => sum + item.convertedCents,
    0,
  );

  return {
    total: fromCents(totalCents),
    currency: targetCurrency,
    breakdown: breakdown.map(({ currency, total, convertedCents }) => ({
      currency,
      total,
      converted: fromCents(convertedCents),
    })),
  };
}
