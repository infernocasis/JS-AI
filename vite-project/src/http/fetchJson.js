import { HttpError } from "./HttpError.js";

/** Убираем query-string из сообщений: там могут быть API-ключи */
const safeUrl = (url) => String(url).split("?")[0];

export async function fetchJson(
  url,
  { headers = {}, timeoutMs = 10_000 } = {},
) {
  const label = safeUrl(url);
  let response;
  try {
    response = await fetch(url, {
      headers: { Accept: "application/json", ...headers },
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    const reason =
      error.name === "TimeoutError"
        ? `timeout after ${timeoutMs} ms`
        : `${error.message} (network error or CORS)`;
    throw new HttpError(`Request to ${label} failed: ${reason}`, {
      url: label,
      cause: error,
    });
  }

  if (!response.ok) {
    throw new HttpError(
      `Request to ${label} failed with status ${response.status}`,
      {
        status: response.status,
        url: label,
      },
    );
  }

  try {
    return await response.json();
  } catch (error) {
    throw new HttpError(`Invalid JSON from ${label}`, {
      status: response.status,
      url: label,
      cause: error,
    });
  }
}
