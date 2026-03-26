import type { ReactElement, ReactNode } from "react";
import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "../store";
import { cardsApi } from "../services/cardsApi";
import { transactionsApi } from "../services/transactionsApi";
import { selectCard, clearSelectedCard } from "../store/uiSlice";
import type { RootState } from "../store";

interface RenderWithProvidersOptions extends Omit<RenderOptions, "wrapper"> {
  preloadedState?: Partial<RootState>;
  initialEntries?: string[];
}

/** Drop-in replacement for RTL's render() with Redux store and Router pre-wired. */
export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    initialEntries = ["/"],
    ...renderOptions
  }: RenderWithProvidersOptions = {},
) {
  // Clean slate before each render
  store.dispatch(cardsApi.util.resetApiState());
  store.dispatch(transactionsApi.util.resetApiState());
  store.dispatch(clearSelectedCard());

  // Apply any preloaded UI state
  if (preloadedState?.ui?.selectedCardId) {
    store.dispatch(
      selectCard({
        id: preloadedState.ui.selectedCardId,
        color: preloadedState.ui.selectedCardColor ?? "",
      }),
    );
  }

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
