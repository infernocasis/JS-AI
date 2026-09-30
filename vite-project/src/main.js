import "./style.css";
import { loadConfig } from "./config/index.js";
import { createFinanceApi } from "./api/financeApi.js";
import { createExchangeRatesApi } from "./api/exchangeRatesApi.js";
import { getDailyRevenue } from "./revenue/getDailyRevenue.js";

const app = document.querySelector("#app");

const formatMoney = (amount, currency) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency }).format(
    amount,
  );

function render(text, state, details = "") {
  app.innerHTML = `
    <h1>Выручка за день</h1>
    <p class="result"></p>
    <p class="details"></p>
  `;
  const result = app.querySelector(".result");
  result.textContent = text; // textContent, а не innerHTML: данные приходят извне
  result.dataset.state = state;
  app.querySelector(".details").textContent = details;
}

async function main() {
  render("Загрузка… (сервер на Render может просыпаться до минуты)", "loading");

  try {
    const config = loadConfig();

    const revenue = await getDailyRevenue({
      financeApi: createFinanceApi(config.finance),
      exchangeRatesApi: createExchangeRatesApi(config.exchangeRates),
      targetCurrency: config.targetCurrency,
    });

    console.log(revenue);

    const details = [
      ...revenue.breakdown.map(({ total, currency, converted }) =>
        currency === revenue.currency
          ? formatMoney(total, currency)
          : `${formatMoney(total, currency)} → ${formatMoney(converted, revenue.currency)}`,
      ),
      `Курсы CurrencyFreaks на ${revenue.ratesDate ?? "неизвестную дату"}`,
    ].join("\n");

    render(formatMoney(revenue.total, revenue.currency), "success", details);
  } catch (error) {
    console.error(error);
    render(`Ошибка: ${error.message}`, "error");
  }
}

main();
