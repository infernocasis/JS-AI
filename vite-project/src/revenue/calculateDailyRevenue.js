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

/** Прибавляет сумму к накопителю своей валюты */
function addPayment(centsByCurrency, { amount, currency }) {
  centsByCurrency.set(
    currency,
    (centsByCurrency.get(currency) ?? 0) + toCents(amount),
  );
}

/**
 * Чистая функция: считает выручку отдельно по каждой валюте.
 * Один проход по каждому источнику, без промежуточных массивов.
 * Возвращает [{ total, currency }, ...]; пустой массив, если оплат нет.
 */
export function calculateDailyRevenue(orderData, cashPayments) {
  assertSourcesShape(orderData, cashPayments);

  const centsByCurrency = new Map();

  // Источник 1: берём только paid, остальные пропускаем без валидации
  orderData.transactions.forEach((transaction, index) => {
    if (transaction?.type !== "paid") return;

    const context = `transactions[${index}]`;
    addPayment(centsByCurrency, {
      amount: validateAmount(transaction.amount, context),
      currency: normalizeCurrency(transaction.currency, context),
    });
  });

  // Источник 2: каждая строка "300 USD" — оплата
  cashPayments.forEach((value, index) => {
    addPayment(centsByCurrency, parseMoneyString(value, index));
  });

  return Array.from(centsByCurrency, ([currency, cents]) => ({
    total: fromCents(cents),
    currency,
  }));
}
