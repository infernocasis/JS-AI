import {
  normalizeCurrency,
  validateAmount,
  parseMoneyString,
  toCents,
  fromCents,
} from "../money/index.js";

function assertSourcesShape(orderData, cashPayments) {
  if (
    orderData == null ||
    typeof orderData !== "object" ||
    !Array.isArray(orderData.transactions)
  ) {
    throw new TypeError(
      "Source 1 must be an object with a `transactions` array",
    );
  }
  if (!Array.isArray(cashPayments)) {
    throw new TypeError("Source 2 must be an array of money strings");
  }
}

function normalizeTransaction({ amount, currency }, index) {
  const context = `transactions[${index}]`;
  return {
    amount: validateAmount(amount, context),
    currency: normalizeCurrency(currency, context),
  };
}

/**
 * Чистая функция: считает выручку отдельно по каждой валюте.
 * Возвращает [{ total, currency }, ...]; пустой массив, если оплат нет.
 */
export function calculateDailyRevenue(orderData, cashPayments) {
  assertSourcesShape(orderData, cashPayments);

  const paidTransactions = orderData.transactions
    .map((transaction, index) => ({ transaction, index }))
    .filter(({ transaction }) => transaction?.type === "paid")
    .map(({ transaction, index }) => normalizeTransaction(transaction, index));

  const payments = [...paidTransactions, ...cashPayments.map(parseMoneyString)];

  const centsByCurrency = payments.reduce((acc, { amount, currency }) => {
    acc.set(currency, (acc.get(currency) ?? 0) + toCents(amount));
    return acc;
  }, new Map());

  return Array.from(centsByCurrency, ([currency, cents]) => ({
    total: fromCents(cents),
    currency,
  }));
}
