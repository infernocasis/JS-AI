import "./style.css";
import { loadConfig } from "./config/index.js";
import { createFinanceApi } from "./api/financeApi.js";
import { createExchangeRatesApi } from "./api/exchangeRatesApi.js";
import { getDailyRevenue } from "./revenue/getDailyRevenue.js";
import { createApp } from "./ui/app.js";

function loadRevenue() {
  const config = loadConfig();
  return getDailyRevenue({
    financeApi: createFinanceApi(config.finance),
    exchangeRatesApi: createExchangeRatesApi(config.exchangeRates),
    targetCurrency: config.targetCurrency,
  });
}

createApp(document.querySelector("#app"), { loadRevenue }).start();
