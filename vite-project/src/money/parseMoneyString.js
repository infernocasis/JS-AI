import { parseAmount } from "./amount.js";
import { normalizeCurrency } from "./currency.js";

/** "300 USD" -> { amount: 300, currency: "USD" } */
export function parseMoneyString(value, index) {
  const context = `cashPayments[${index}]`;
  if (typeof value !== "string") {
    throw new TypeError(
      `Money value must be a string, got ${typeof value} (${context})`,
    );
  }
  const parts = value.trim().split(/\s+/);
  if (parts.length !== 2) {
    throw new Error(
      `Invalid money string "${value}", expected "<amount> <CURRENCY>" (${context})`,
    );
  }
  const [rawAmount, rawCurrency] = parts;
  return {
    amount: parseAmount(rawAmount, context),
    currency: normalizeCurrency(rawCurrency, context),
  };
}
