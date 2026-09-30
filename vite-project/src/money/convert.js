/**
 * Конвертация суммы в центах через базовую валюту курсов.
 * rates[X] = сколько X дают за 1 единицу base.
 * from -> base: делим на rates[from]; base -> to: умножаем на rates[to].
 */
export function convertCents(cents, from, to, { base, rates }) {
  if (from === to) return cents;

  const fromRate = rates[from];
  const toRate = rates[to];
  if (!fromRate) throw new Error(`No exchange rate for ${from} (base ${base})`);
  if (!toRate) throw new Error(`No exchange rate for ${to} (base ${base})`);

  return Math.round((cents * toRate) / fromRate);
}
