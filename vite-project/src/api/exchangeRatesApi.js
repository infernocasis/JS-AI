import { fetchJson } from "../http/fetchJson.js";
import { normalizeCurrency } from "../money/index.js";

/** CurrencyFreaks отдаёт курсы строками: { "EUR": "0.9187" } -> { EUR: 0.9187 } */
function parseRates(rawRates) {
  if (rawRates == null || typeof rawRates !== "object") {
    throw new TypeError("Exchange rates response has no `rates` object");
  }
  const rates = {};
  for (const [code, value] of Object.entries(rawRates)) {
    const rate = Number(value);
    if (Number.isFinite(rate) && rate > 0) {
      rates[code.toUpperCase()] = rate;
    }
  }
  return rates;
}

/**
 * Адаптер к CurrencyFreaks. Наружу отдаёт формат, не зависящий от провайдера:
 * { base: "USD", date: "...", rates: { EUR: 0.92, USD: 1, ... } }
 * Сменится провайдер — переписывается только этот файл.
 */
export function createExchangeRatesApi({ baseUrl, apiKey, timeoutMs }) {
  return {
    async getLatestRates() {
      const url = new URL(`${baseUrl}/rates/latest`);
      url.searchParams.set("apikey", apiKey);

      const data = await fetchJson(url, { timeoutMs });
      const base = normalizeCurrency(data?.base, "exchange rates base");

      return {
        base,
        date: data.date ?? null,
        rates: { ...parseRates(data.rates), [base]: 1 },
      };
    },
  };
}
