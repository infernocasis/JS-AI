const AMOUNT_RE = /^\d+(\.\d{1,2})?$/; // целое или до 2 знаков после точки

export function validateAmount(amount, context) {
  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    throw new TypeError(`Amount must be a finite number (${context})`);
  }
  if (amount < 0) {
    throw new RangeError(`Amount cannot be negative (${context})`);
  }
  return amount;
}

/** Строгий парсинг: Number() сам по себе пропускает "", "1e3", "0x10", "Infinity" */
export function parseAmount(raw, context) {
  if (!AMOUNT_RE.test(raw)) {
    throw new Error(`Invalid amount "${raw}" (${context})`);
  }
  return validateAmount(Number(raw), context);
}

export const toCents = (amount) => Math.round(amount * 100);
export const fromCents = (cents) => cents / 100;
