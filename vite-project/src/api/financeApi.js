import { fetchJson } from "../http/fetchJson.js";

export function createFinanceApi({ baseUrl, apiKey, timeoutMs }) {
  const get = (path) =>
    fetchJson(`${baseUrl}${path}`, {
      headers: { "x-api-key": apiKey },
      timeoutMs,
    });

  return {
    /** Источник 1: { transactions: [...], address: {...} } */
    getTransactions: () => get("/finance1"),
    /** Источник 2: ["300 USD", ...] */
    getCashPayments: () => get("/finance2"),
  };
}
