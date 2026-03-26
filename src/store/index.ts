import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./uiSlice";
import { cardsApi } from "../services/cardsApi";
import { transactionsApi } from "../services/transactionsApi";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    [cardsApi.reducerPath]: cardsApi.reducer,
    [transactionsApi.reducerPath]: transactionsApi.reducer,
  },
  // RTK Query middleware handles cache lifecycle, invalidation, and polling
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(cardsApi.middleware)
      .concat(transactionsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
