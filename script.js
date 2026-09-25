const MONEY_STRING_RE = /^\s*(-?\d+(?:\.\d+)?)\s+([A-Z]{3})\s*$/;

const salesDatasoure1 = {
  transactions: [
    {
      type: "paid",

      amount: 100,

      currency: "USD",
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

/** "300 USD" -> { amount: 300, currency: "USD" } */
function parseMoneyString(value) {
  const match = MONEY_STRING_RE.exec(String(value));
  if (!match) {
    throw new Error(`Invalid money string: "${value}"`);
  }
  return { amount: Number(match[1]), currency: match[2] };
}

/** Считаем в центах, чтобы не ловить 0.1 + 0.2 = 0.30000000000000004 */
const toCents = (amount) => Math.round(amount * 100);

function calculateDailyRevenue(
  orderData,
  cashPayments,
  defaultCurrency = "USD",
) {
  const paidTransactions = (orderData?.transactions ?? [])
    .filter(({ type }) => type === "paid")
    .map(({ amount, currency }) => ({ amount, currency }));

  const parsedCashPayments = (cashPayments ?? []).map(parseMoneyString);

  const payments = [...paidTransactions, ...parsedCashPayments];

  if (payments.length === 0) {
    return { total: 0, currency: defaultCurrency };
  }

  const currency = payments[0].currency;

  const totalCents = payments.reduce((sum, payment) => {
    if (payment.currency !== currency) {
      throw new Error(
        `Currency mismatch: expected ${currency}, got ${payment.currency}. ` +
          `Conversion is not supported.`,
      );
    }
    return sum + toCents(payment.amount);
  }, 0);

  return { total: totalCents / 100, currency };
}

console.log(calculateDailyRevenue(salesDatasoure1, salesDataSource2));
