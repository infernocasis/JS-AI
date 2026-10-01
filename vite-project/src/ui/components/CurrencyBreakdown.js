import { h } from "../dom.js";
import { formatMoney, formatPercent } from "../format.js";
import { Card } from "./Card.js";

function BreakdownRow({ currency, total, converted, share }, targetCurrency) {
  const isTarget = currency === targetCurrency;

  return h("li", { class: "py-4 first:pt-0 last:pb-0" }, [
    h("div", { class: "flex items-center justify-between gap-4" }, [
      h("div", { class: "flex items-center gap-3" }, [
        h("span", {
          class:
            "rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-700",
          text: currency,
        }),
        h("span", {
          class: "text-lg font-semibold tabular-nums",
          text: formatMoney(total, currency),
        }),
      ]),
      h("div", { class: "text-right" }, [
        !isTarget &&
          h("p", {
            class: "text-sm font-medium tabular-nums text-slate-700",
            text: `≈ ${formatMoney(converted, targetCurrency)}`,
          }),
        h("p", {
          class: "text-xs text-slate-500",
          text: `${formatPercent(share)} от итога`,
        }),
      ]),
    ]),
    h("div", { class: "mt-2 h-2 overflow-hidden rounded-full bg-slate-100" }, [
      h("div", {
        class: "h-full rounded-full bg-indigo-500",
        style: { width: `${(share * 100).toFixed(2)}%` },
      }),
    ]),
  ]);
}

export function CurrencyBreakdown({ breakdown, currency }) {
  if (breakdown.length === 0) {
    return Card({ title: "По валютам" }, [
      h("p", { class: "text-sm text-slate-500", text: "Оплат за день нет." }),
    ]);
  }

  return Card(
    {
      title: "По валютам",
      subtitle: "Суммы в исходной валюте и их вклад в итог",
    },
    [
      h(
        "ul",
        { class: "divide-y divide-slate-100" },
        breakdown.map((item) => BreakdownRow(item, currency)),
      ),
    ],
  );
}
