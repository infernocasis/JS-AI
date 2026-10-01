/**
 * Мини-хелпер для создания DOM-элементов на нативном JS.
 * Текст всегда идёт через textContent / text-ноды — данные с сервера не могут внедрить HTML (XSS).
 *
 * h("button", { class: "px-4", text: "OK", attrs: { type: "button" }, on: { click: fn } }, [children])
 */
export function h(
  tag,
  { class: className, text, attrs = {}, style = {}, on = {} } = {},
  children = [],
) {
  const el = document.createElement(tag);

  if (className) el.className = className;
  if (text != null) el.textContent = text;

  for (const [name, value] of Object.entries(attrs)) {
    if (value === true) el.setAttribute(name, "");
    else if (value != null && value !== false) el.setAttribute(name, value);
  }
  Object.assign(el.style, style);
  for (const [event, handler] of Object.entries(on)) {
    el.addEventListener(event, handler);
  }
  for (const child of [children].flat(Infinity)) {
    if (child != null && child !== false) el.append(child);
  }
  return el;
}

/** Полностью заменяет содержимое контейнера */
export function mount(root, ...nodes) {
  root.replaceChildren(...nodes);
}
