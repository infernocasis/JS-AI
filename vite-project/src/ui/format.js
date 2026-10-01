const LOCALE = "ru-RU";
const moneyFormatters = new Map();

export function formatMoney(amount, currency) {
  if (!moneyFormatters.has(currency)) {
    moneyFormatters.set(
      currency,
      new Intl.NumberFormat(LOCALE, { style: "currency", currency }),
    );
  }
  return moneyFormatters.get(currency).format(amount);
}

const rateFormatter = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});
export const formatRate = (rate) => rateFormatter.format(rate);

const percentFormatter = new Intl.NumberFormat(LOCALE, {
  style: "percent",
  maximumFractionDigits: 1,
});
export const formatPercent = (value) => percentFormatter.format(value);

const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: "long",
  timeStyle: "short",
});

/** CurrencyFreaks отдаёт дату как "2026-09-30 00:00:00+00" — приводим к ISO */
export function formatRatesDate(raw) {
  if (!raw) return "дата неизвестна";
  const iso = String(raw)
    .trim()
    .replace(" ", "T")
    .replace(/([+-]\d{2})$/, "$1:00");
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? String(raw)
    : dateFormatter.format(date);
}
