import { useGetCardsQuery } from "../../services/cardsApi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import CardItem from "../CardItem/CardItem";
import styled from "styled-components";
import { selectCard } from "../../store/uiSlice";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export const CARD_ID_PARAM = "cardId";

export default function CardList() {
  const dispatch = useAppDispatch();
  const selectedCardId = useAppSelector((state) => state.ui.selectedCardId);
  const { data: cards = [], isLoading, isError } = useGetCardsQuery();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (cards.length === 0) return;

    const urlCardId = searchParams.get(CARD_ID_PARAM);
    if (!urlCardId) return;

    const matchedCard = cards.find((card) => card.id === urlCardId);
    if (matchedCard && matchedCard.id !== selectedCardId) {
      dispatch(selectCard({ id: matchedCard.id, color: matchedCard.color }));
    }
  }, [cards, searchParams, selectedCardId, dispatch]);

  function handleSelectCard(id: string) {
    const card = cards.find((c) => c.id === id);
    if (!card) return;

    dispatch(selectCard({ id: card.id, color: card.color }));

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set(CARD_ID_PARAM, id);
        next.delete("minAmount");
        return next;
      },
      { replace: true },
    );
  }

  if (isLoading) {
    return (
      <CardListContainer>
        <div aria-live="polite" aria-busy="true">
          Loading cards...
        </div>
      </CardListContainer>
    );
  }

  if (isError) {
    return (
      <CardListContainer>
        <div role="alert">Failed to load cards. Please try again.</div>
      </CardListContainer>
    );
  }

  return (
    <CardListContainer>
      <CardGrid aria-label="Payment Cards">
        {cards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            isSelected={card.id === selectedCardId}
            onSelect={handleSelectCard}
          />
        ))}
      </CardGrid>
    </CardListContainer>
  );
}

const CardGrid = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 3rem;
`;

const CardListContainer = styled.div`
  width: 100%;
  max-width: 780px;
  margin: 0 auto;
  padding: 1.5rem 0;
`;
