import { h } from "../dom.js";

export function Layout({ isLoading, onRefresh }, content) {
  return h(
    "div",
    { class: "min-h-screen bg-slate-50 text-slate-900 antialiased" },
    [
      h("div", { class: "mx-auto max-w-3xl px-4 py-10 sm:py-14" }, [
        h(
          "header",
          { class: "mb-8 flex flex-wrap items-end justify-between gap-4" },
          [
            h("div", {}, [
              h("p", {
                class: "text-sm font-medium text-indigo-600",
                text: "Финансы",
              }),
              h("h1", {
                class: "mt-1 text-3xl font-bold tracking-tight sm:text-4xl",
                text: "Выручка за день",
              }),
              h("p", {
                class: "mt-2 text-sm text-slate-500",
                text: "Оплаченные транзакции и платежи из двух источников по актуальному курсу",
              }),
            ]),
            h("button", {
              class:
                "inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50",
              text: isLoading ? "Обновление…" : "Обновить",
              attrs: { type: "button", disabled: isLoading },
              on: { click: onRefresh },
            }),
          ],
        ),
        h(
          "main",
          {
            class: "space-y-6",
            attrs: {
              "aria-live": "polite",
              "aria-busy": isLoading ? "true" : "false",
            },
          },
          content,
        ),
      ]),
    ],
  );
}
