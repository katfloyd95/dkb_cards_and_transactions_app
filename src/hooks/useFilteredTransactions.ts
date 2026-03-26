import { useSearchParams } from "react-router-dom";
import { useGetTransactionsByCardIdQuery } from "../services/transactionsApi";
import type { Transaction } from "../types";

export const FILTER_PARAM = "minAmount";

interface UseFilteredTransactionsResult {
  transactions: Transaction[];
  isLoading: boolean;
  isError: boolean;
  filterValue: string;
  setFilterValue: (value: string) => void;
}

/**
 * Fetches transactions for a given card and applies an amount filter
 * from the URL search params.
 *
 * Keeping the filter in the URL means it survives a page refresh and
 * can be shared as a link. Switching cards clears it automatically
 * via handleSelectCard in CardList.
 */

export function useFilteredTransactions(
  cardId: string | null,
): UseFilteredTransactionsResult {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterValue = searchParams.get(FILTER_PARAM) ?? "";

  const {
    data = [],
    isLoading,
    isError,
  } = useGetTransactionsByCardIdQuery(cardId as string, {
    skip: cardId === null,
  });

  const parsedMinimum = parseFloat(filterValue);
  const transactions =
    filterValue !== "" && !isNaN(parsedMinimum)
      ? data.filter((transaction) => transaction.amount >= parsedMinimum)
      : data;

  function setFilterValue(value: string) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === "") {
          next.delete(FILTER_PARAM);
        } else {
          next.set(FILTER_PARAM, value);
        }
        return next;
      },
      { replace: true },
    );
  }

  return { transactions, isLoading, isError, filterValue, setFilterValue };
}
