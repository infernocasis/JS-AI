const CURRENCY_RE = /^[A-Z]{3}$/; // ISO 4217: ровно 3 латинские буквы
const AMOUNT_RE = /^\d+(\.\d{1,2})?$/; // целое или до 2 знаков после точки

const salesDataSource1 = {
  transactions: [
    {
      type: "paid",

      amount: 100,

      currency: "usd",
    },

    {
      type: "pending",

      amount: 50,

      currency: "USD",
    },

    {
      type: "paid",

      amount: 800,

      currency: "USD",
    },

    {
      type: "paid",

      amount: 130,

      currency: "USD",
    },

    {
      type: "rejected",

      amount: 560,

      currency: "USD",
    },
  ],
  address: {
    city: "New York",

    street: "5th Avenue",

    houseNumber: 10,
  },
};

const salesDataSource2 = ["300 USD", "150 USD", "200 USD", "400 USD"];

/** "usd" / " Usd " -> "USD"; всё, что не 3 буквы, -> ошибка */
function normalizeCurrency(currency, context) {
  if (typeof currency !== "string") {
    throw new TypeError(`Currency must be a string (${context})`);
  }
  const normalized = currency.trim().toUpperCase();
  if (!CURRENCY_RE.test(normalized)) {
    throw new Error(`Invalid currency code "${currency}" (${context})`);
  }
  return normalized;
}

function validateAmount(amount, context) {
  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    throw new TypeError(`Amount must be a finite number (${context})`);
  }
  if (amount < 0) {
    throw new RangeError(`Amount cannot be negative (${context})`);
  }
  return amount;
}

/** "300 USD" -> { amount: 300, currency: "USD" } */
function parseMoneyString(value) {
  if (typeof value !== "string") {
    throw new TypeError(`Money value must be a string, got ${typeof value}`);
  }
  const parts = value.trim().split(/\s+/);
  if (parts.length !== 2) {
    throw new Error(
      `Invalid money string "${value}", expected "<amount> <CURRENCY>"`,
    );
  }
  const [rawAmount, rawCurrency] = parts;
  if (!AMOUNT_RE.test(rawAmount)) {
    throw new Error(`Invalid amount "${rawAmount}" in "${value}"`);
  }
  return {
    amount: validateAmount(Number(rawAmount), `"${value}"`),
    currency: normalizeCurrency(rawCurrency, `"${value}"`),
  };
}

function normalizeTransaction({ amount, currency }, index) {
  const context = `transactions[${index}]`;
  return {
    amount: validateAmount(amount, context),
    currency: normalizeCurrency(currency, context),
  };
}

const toCents = (amount) => Math.round(amount * 100);

function calculateDailyRevenue(
  orderData,
  cashPayments,
  defaultCurrency = "USD",
) {
  const paidTransactions = (orderData?.transactions ?? [])
    .map((transaction, index) => ({ transaction, index }))
    .filter(({ transaction }) => transaction.type === "paid")
    .map(({ transaction, index }) => normalizeTransaction(transaction, index));

  const parsedCashPayments = (cashPayments ?? []).map(parseMoneyString);

  const payments = [...paidTransactions, ...parsedCashPayments];

  if (payments.length === 0) {
    return {
      total: 0,
      currency: normalizeCurrency(defaultCurrency, "defaultCurrency"),
    };
  }

  const currency = payments[0].currency;

  const totalCents = payments.reduce((sum, payment) => {
    if (payment.currency !== currency) {
      throw new Error(
        `Currency mismatch: expected ${currency}, got ${payment.currency}. Conversion is not supported.`,
      );
    }
    return sum + toCents(payment.amount);
  }, 0);

  return { total: totalCents / 100, currency };
}

console.log(calculateDailyRevenue(salesDataSource1, salesDataSource2));
