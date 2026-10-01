import { h } from "../dom.js";
import { formatRate, formatRatesDate } from "../format.js";
import { Card } from "./Card.js";

const SOURCE_URL = "https://currencyfreaks.com";

export function ExchangeRates({ breakdown, currency, ratesDate }) {
  const foreign = breakdown.filter((item) => item.currency !== currency);

  const body =
    foreign.length === 0
      ? h("p", {
          class: "text-sm text-slate-500",
          text: `Все платежи уже в ${currency} — конвертация не понадобилась.`,
        })
      : h(
          "ul",
          { class: "grid gap-3 sm:grid-cols-2" },
          foreign.map(({ currency: from, rate }) =>
            h(
              "li",
              { class: "rounded-xl border border-slate-200 bg-slate-50 p-4" },
              [
                h("p", {
                  class:
                    "text-xs font-medium uppercase tracking-wide text-slate-500",
                  text: `${from} → ${currency}`,
                }),
                h("p", {
                  class: "mt-1 text-xl font-semibold tabular-nums",
                  text: `1 ${from} = ${formatRate(rate)} ${currency}`,
                }),
                h("p", {
                  class: "mt-1 text-xs text-slate-500 tabular-nums",
                  text: `1 ${currency} = ${formatRate(1 / rate)} ${from}`,
                }),
              ],
            ),
          ),
        );

  return Card(
    { title: "Курсы валют", subtitle: `На ${formatRatesDate(ratesDate)}` },
    [
      body,
      h("p", { class: "mt-4 text-xs text-slate-500" }, [
        "Источник: ",
        h("a", {
          class:
            "font-medium text-indigo-600 underline-offset-2 hover:underline",
          text: "CurrencyFreaks",
          attrs: {
            href: SOURCE_URL,
            target: "_blank",
            rel: "noopener noreferrer",
          },
        }),
      ]),
    ],
  );
}
