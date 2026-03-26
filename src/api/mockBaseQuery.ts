import cards from "../data/cards.json";
import transactions from "../data/transactions.json";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { Card, TransactionMap } from "../types/index";

/**
 * Custom RTK Query baseQuery: reads from local JSON with a simulated
 * network delay so loading states are exercised during development.
 *
 * To point at a real API, replace this with fetchBaseQuery({ baseUrl: '...' })
 * in cardsApi.ts and transactionsApi.ts. No other changes needed.
 *
 * Supported routes:
 * GET /cards
 * GET /transactions/:cardId
 */

const SIMULATED_DELAY_MS = 300;

const mockData: Record<string, unknown> = {
  "/cards": cards as Card[],
  ...Object.fromEntries(
    Object.entries(transactions as TransactionMap).map(
      ([cardId, cardTransactions]) => [
        `/transactions/${cardId}`,
        cardTransactions,
      ],
    ),
  ),
};

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export type MockArgs = { url: string };

export const mockBaseQuery: BaseQueryFn<
  MockArgs,
  unknown,
  { status: number; error: string }
> = async ({ url }) => {
  await delay(SIMULATED_DELAY_MS);

  if (url in mockData) {
    return { data: mockData[url] };
  }

  return {
    error: { status: 404, error: `No mock data found for ${url}` },
  };
};
