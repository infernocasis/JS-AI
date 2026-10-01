import { TotalCard } from "./TotalCard.js";
import { CurrencyBreakdown } from "./CurrencyBreakdown.js";
import { ExchangeRates } from "./ExchangeRates.js";

export function RevenueView(revenue) {
  return [
    TotalCard(revenue),
    CurrencyBreakdown(revenue),
    ExchangeRates(revenue),
  ];
}
