/**
 * Курс from -> to через базовую валюту провайдера.
 * rates[X] = сколько X дают за 1 единицу base, поэтому 1 from = rates[to] / rates[from] to.
 */
export function getRate(from, to, { base, rates }) {
  if (from === to) return 1;

  const fromRate = rates[from];
  const toRate = rates[to];
  if (!fromRate) throw new Error(`No exchange rate for ${from} (base ${base})`);
  if (!toRate) throw new Error(`No exchange rate for ${to} (base ${base})`);

  return toRate / fromRate;
}

export function convertCents(cents, from, to, exchangeRates) {
  return Math.round(cents * getRate(from, to, exchangeRates));
}
