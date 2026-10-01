import { h } from "../dom.js";

/** Базовая карточка с необязательным заголовком секции */
export function Card(
  { title, subtitle, class: extra = "" } = {},
  children = [],
) {
  return h(
    "section",
    {
      class: `rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${extra}`,
    },
    [
      title &&
        h("header", { class: "mb-4" }, [
          h("h2", {
            class: "text-base font-semibold text-slate-900",
            text: title,
          }),
          subtitle &&
            h("p", { class: "mt-1 text-sm text-slate-500", text: subtitle }),
        ]),
      children,
    ],
  );
}
