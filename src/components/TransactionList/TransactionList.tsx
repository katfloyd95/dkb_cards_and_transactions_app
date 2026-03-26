import { useFilteredTransactions } from "../../hooks/useFilteredTransactions";
import { useAppSelector } from "../../store/hooks";
import AmountFilter from "../AmountFilter/AmountFilter";
import TransactionItem from "../TransactionItem/TransactionItem";
import styled from "styled-components";
import settings from "../../settings";

export default function TransactionList() {
  const selectedCardId = useAppSelector((state) => state.ui.selectedCardId);
  const selectedCardColor = useAppSelector(
    (state) => state.ui.selectedCardColor,
  );

  const { transactions, isLoading, isError, filterValue, setFilterValue } =
    useFilteredTransactions(selectedCardId);

  if (selectedCardId === null) {
    return (
      <EmptyState>
        <p>Select a card above to view its transactions.</p>
      </EmptyState>
    );
  }

  return (
    <section aria-label="Transactions">
      <TransactionListContainer>
        <FilterWrapper>
          <AmountFilter value={filterValue} onChange={setFilterValue} />
        </FilterWrapper>
        <div aria-live="polite" aria-atomic="false">
          {isLoading && (
            <FeedbackText aria-busy="true">
              Loading transactions...
            </FeedbackText>
          )}

          {isError && (
            <FeedbackText role="alert">
              Failed to load transactions. Please try again.
            </FeedbackText>
          )}

          {!isLoading && !isError && (
            <>
              {transactions.length === 0 ? (
                <FeedbackText>
                  No transactions match the current filter.
                </FeedbackText>
              ) : (
                <TransactionUl>
                  {transactions.map((transaction) => (
                    <TransactionItem
                      key={transaction.id}
                      transaction={transaction}
                      color={selectedCardColor}
                    />
                  ))}
                </TransactionUl>
              )}
            </>
          )}
        </div>
      </TransactionListContainer>
    </section>
  );
}

const EmptyState = styled.div`
  color: ${settings.colors.foregroundSecondary};
  font-size: 0.95rem;
  padding: 2rem 0;
  text-align: center;
`;

const FilterWrapper = styled.div`
  margin-bottom: 1.5rem;
`;

const TransactionUl = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  list-style: none;
  margin: 0;
  padding: 1rem;
`;

const FeedbackText = styled.div`
  color: ${settings.colors.foregroundSecondary};
  font-size: 0.9rem;
  padding: 1rem 0;
`;

const TransactionListContainer = styled.div`
  width: 100%;
  max-width: 780px;
  margin: 0 auto;
  padding: 1.5rem 0;
`;
