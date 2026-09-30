import { normalizeCurrency } from "../money/index.js";

function requireEnv(name) {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(`Missing required env variable: ${name}`);
  }
  return value;
}

const trimSlash = (url) => url.replace(/\/+$/, "");

export function loadConfig() {
  return Object.freeze({
    finance: {
      baseUrl: trimSlash(requireEnv("VITE_CPA_API_BASE_URL")),
      apiKey: requireEnv("VITE_CPA_API_KEY"),
      timeoutMs: Number(import.meta.env.VITE_CPA_API_TIMEOUT_MS) || 60_000,
    },
    exchangeRates: {
      baseUrl: trimSlash(requireEnv("VITE_FX_API_BASE_URL")),
      apiKey: requireEnv("VITE_FX_API_KEY"),
      timeoutMs: Number(import.meta.env.VITE_FX_API_TIMEOUT_MS) || 10_000,
    },
    targetCurrency: normalizeCurrency(
      import.meta.env.VITE_TARGET_CURRENCY ?? "USD",
      "VITE_TARGET_CURRENCY",
    ),
  });
}
