import { createApi } from "@reduxjs/toolkit/query/react";
import { mockBaseQuery } from "../api/mockBaseQuery";
import type { Card } from "../types";

export const cardsApi = createApi({
  reducerPath: "cardsApi",
  // To point at a real API, replace mockBaseQuery with:
  // fetchBaseQuery({ baseUrl: 'https://api.example.com' })
  baseQuery: mockBaseQuery,
  endpoints: (builder) => ({
    getCards: builder.query<Card[], void>({
      query: () => ({ url: "/cards" }),
    }),
  }),
});

export const { useGetCardsQuery } = cardsApi;
