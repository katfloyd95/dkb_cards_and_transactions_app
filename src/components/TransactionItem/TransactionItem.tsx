import settings from "../../settings";
import type { Transaction } from "../../types";
import styled from "styled-components";

interface TransactionItemProps {
  transaction: Transaction;
  color: string;
}

function formatAmount(amount: number): string {
  const formatted = Math.abs(amount).toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${amount < 0 ? "−" : ""}${formatted} €`;
}

export default function TransactionItem({
  transaction,
  color,
}: TransactionItemProps) {
  const isNegative = transaction.amount < 0;

  return (
    <TransactionListItem $color={color} $isNegative={isNegative}>
      <span>{transaction.description}</span>
      <span>{formatAmount(transaction.amount)}</span>
    </TransactionListItem>
  );
}

interface TransactionListItemProps {
  $color: string;
  $isNegative: boolean;
}

const TransactionListItem = styled.li<TransactionListItemProps>`
  background-color: ${(props) => props.$color};
  color: ${settings.colors.backgroundSecondary};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border: ${({ $isNegative }) =>
    $isNegative
      ? `3px solid ${settings.colors.error}`
      : `1px solid ${settings.colors.foreground}`};
  border-radius: 0.75rem;
`;
