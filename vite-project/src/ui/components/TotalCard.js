import { h } from "../dom.js";
import { formatMoney } from "../format.js";

export function TotalCard({ total, currency, breakdown }) {
  const count = breakdown.length;
  const caption =
    count > 1
      ? `Пересчитано в ${currency} из ${count} валют`
      : `Все платежи в ${breakdown[0]?.currency ?? currency}`;

  return h(
    "section",
    {
      class:
        "rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white shadow-lg sm:p-8",
    },
    [
      h("p", {
        class: "text-sm font-medium text-indigo-100",
        text: `Итого, ${currency}`,
      }),
      h("p", {
        class:
          "mt-2 text-4xl font-bold tracking-tight tabular-nums sm:text-5xl",
        text: formatMoney(total, currency),
      }),
      h("p", { class: "mt-3 text-sm text-indigo-100", text: caption }),
    ],
  );
}
