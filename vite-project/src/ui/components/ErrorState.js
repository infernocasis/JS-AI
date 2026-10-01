import { h } from "../dom.js";
import { describeError } from "../describeError.js";

export function ErrorState({ error, onRetry }) {
  const { title, hint } = describeError(error);

  return h(
    "section",
    {
      class: "rounded-2xl border border-red-200 bg-red-50 p-6",
      attrs: { role: "alert" },
    },
    [
      h("div", { class: "flex items-start gap-4" }, [
        h("div", {
          class:
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-lg font-bold text-red-600",
          text: "!",
          attrs: { "aria-hidden": "true" },
        }),
        h("div", { class: "min-w-0 flex-1" }, [
          h("h2", {
            class: "text-base font-semibold text-red-900",
            text: title,
          }),
          h("p", { class: "mt-1 text-sm text-red-800", text: hint }),
          h("details", { class: "mt-3 text-sm text-red-700" }, [
            h("summary", {
              class: "cursor-pointer select-none font-medium",
              text: "Подробности",
            }),
            h("pre", {
              class:
                "mt-2 overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-red-100/70 p-3 font-mono text-xs",
              text: error?.message ?? String(error),
            }),
          ]),
          h("button", {
            class:
              "mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2",
            text: "Попробовать снова",
            attrs: { type: "button" },
            on: { click: onRetry },
          }),
        ]),
      ]),
    ],
  );
}
