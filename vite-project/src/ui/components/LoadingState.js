import { h } from "../dom.js";
import { Card } from "./Card.js";

const bar = (width) =>
  h("div", { class: `h-4 animate-pulse rounded bg-slate-200 ${width}` });

export function LoadingState() {
  return [
    Card({}, [
      bar("w-32"),
      h("div", {
        class: "mt-4 h-10 w-64 animate-pulse rounded-lg bg-slate-200",
      }),
      h("p", {
        class: "mt-4 text-sm text-slate-500",
        text: "Загружаем данные… Сервер на Render может просыпаться до минуты.",
      }),
    ]),
    Card({}, [
      h("div", { class: "space-y-3" }, [
        bar("w-full"),
        bar("w-5/6"),
        bar("w-2/3"),
      ]),
    ]),
  ];
}
