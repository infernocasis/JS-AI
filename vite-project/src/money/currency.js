const CURRENCY_RE = /^[A-Z]{3}$/; // ISO 4217: ровно 3 латинские буквы

/** "usd" / " Usd " -> "USD"; всё, что не 3 латинские буквы, -> ошибка */
export function normalizeCurrency(currency, context) {
  if (typeof currency !== "string") {
    throw new TypeError(`Currency must be a string (${context})`);
  }
  const normalized = currency.trim().toUpperCase();
  if (!CURRENCY_RE.test(normalized)) {
    throw new Error(`Invalid currency code "${currency}" (${context})`);
  }
  return normalized;
}
