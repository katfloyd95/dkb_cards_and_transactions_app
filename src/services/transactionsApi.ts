import { createApi } from "@reduxjs/toolkit/query/react";
import { mockBaseQuery } from "../api/mockBaseQuery";
import type { Transaction } from "../types";

export const transactionsApi = createApi({
  reducerPath: "transactionsApi",
  // To point at a real API, replace mockBaseQuery with:
  // fetchBaseQuery({ baseUrl: 'https://api.example.com' })
  baseQuery: mockBaseQuery,
  endpoints: (builder) => ({
    getTransactionsByCardId: builder.query<Transaction[], string>({
      query: (cardId) => ({ url: `/transactions/${cardId}` }),
    }),
  }),
});

export const { useGetTransactionsByCardIdQuery } = transactionsApi;
