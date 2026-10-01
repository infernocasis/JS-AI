import { mount } from "./dom.js";
import { Layout } from "./components/Layout.js";
import { LoadingState } from "./components/LoadingState.js";
import { ErrorState } from "./components/ErrorState.js";
import { RevenueView } from "./components/RevenueView.js";

/**
 * Контроллер страницы: три состояния (loading / success / error) и перерисовка.
 * Откуда брать данные, ему передают снаружи — loadRevenue.
 */
export function createApp(root, { loadRevenue }) {
  let isLoading = false;

  const render = (content) =>
    mount(root, Layout({ isLoading, onRefresh: load }, content));

  async function load() {
    if (isLoading) return;
    isLoading = true;
    render(LoadingState());

    try {
      const revenue = await loadRevenue();
      isLoading = false;
      render(RevenueView(revenue));
    } catch (error) {
      console.error(error);
      isLoading = false;
      render(ErrorState({ error, onRetry: load }));
    }
  }

  return { start: load };
}
