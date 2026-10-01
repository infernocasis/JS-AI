import { getRate, toCents, fromCents } from "../money/index.js";

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
  const items = totalsByCurrency.map(({ total, currency }) => {
    const rate = getRate(currency, targetCurrency, exchangeRates);
    return {
      currency,
      total,
      rate,
      convertedCents: Math.round(toCents(total) * rate),
    };
  });

  const totalCents = items.reduce((sum, item) => sum + item.convertedCents, 0);

  const breakdown = items
    .map(({ currency, total, rate, convertedCents }) => ({
      currency,
      total,
      rate, // 1 currency = rate targetCurrency
      converted: fromCents(convertedCents),
      share: totalCents > 0 ? convertedCents / totalCents : 0,
    }))
    .sort((a, b) => b.converted - a.converted);

  return { total: fromCents(totalCents), currency: targetCurrency, breakdown };
}
