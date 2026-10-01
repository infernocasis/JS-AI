import { HttpError } from "../http/HttpError.js";

/** Переводит техническую ошибку в понятный пользователю заголовок и подсказку */
export function describeError(error) {
  if (error instanceof HttpError) {
    const { status } = error;
    if (!status) {
      return {
        title: "Нет связи с сервером",
        hint: "Проверь интернет. Сервер на Render мог не успеть проснуться — попробуй ещё раз.",
      };
    }
    if (status === 401 || status === 403) {
      return {
        title: "Нет доступа к API",
        hint: "Проверь API-ключи в .env.local и перезапусти dev-сервер.",
      };
    }
    if (status === 429) {
      return {
        title: "Превышен лимит запросов",
        hint: "Лимит бесплатного тарифа исчерпан. Попробуй позже.",
      };
    }
    if (status >= 500) {
      return {
        title: "Сервер вернул ошибку",
        hint: "Проблема на стороне сервиса. Попробуй ещё раз через минуту.",
      };
    }
    return {
      title: `Ошибка запроса (${status})`,
      hint: "Сервер отклонил запрос.",
    };
  }

  if (error?.message?.startsWith("Missing required env")) {
    return {
      title: "Не настроено окружение",
      hint: "Создай .env.local по образцу .env.example и перезапусти npm run dev.",
    };
  }

  return {
    title: "Не удалось посчитать выручку",
    hint: "Данные пришли в неожиданном формате.",
  };
}
