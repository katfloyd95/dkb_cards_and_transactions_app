import styled from "styled-components";
import type { Card } from "../../types";
import settings from "../../settings";

interface CardItemProps {
  card: Card;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function CardItem({
  card,
  isSelected,
  onSelect,
}: CardItemProps) {
  return (
    <CardButton
      $color={card.color}
      $isSelected={isSelected}
      onClick={() => onSelect(card.id)}
      aria-pressed={isSelected}
    >
      <CardDescription>{card.description}</CardDescription>
      <CardId>Card Id: {card.id}</CardId>
    </CardButton>
  );
}

interface CardButtonProps {
  $color: string;
  $isSelected: boolean;
}

const CardButton = styled.button<CardButtonProps>`
  background-color: ${(props) => props.$color};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border: ${({ $isSelected }) =>
    $isSelected
      ? `3px solid ${settings.colors.foregroundSecondary}`
      : `1px solid ${settings.colors.foreground}`};
  border-radius: 0.75rem;
  text-decoration: none;
  cursor: pointer;
  min-height: 150px;
  width: 250px;
  transition:
    transform 0.1s ease,
    box-shadow 0.15s ease;

  &:focus-visible {
    outline: 2px solid ${settings.colors.foregroundSecondary};
    outline-offset: 2px;
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }
`;

const CardDescription = styled.p`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${settings.colors.backgroundSecondary};
  margin: 0;
`;

const CardId = styled.p`
  font-size: 0.8rem;
  color: ${settings.colors.backgroundSecondary};
  margin: 0;
`;
