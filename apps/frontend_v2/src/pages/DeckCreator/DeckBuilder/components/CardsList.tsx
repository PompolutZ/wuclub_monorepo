import { useDeckBuilderDispatcher } from "../..";
import { CHAMPIONSHIP_FORMAT } from "@fxdxpz/wudb";
import { toggleCardAction } from "../../reducer";
import type { EnrichedCard } from "../../reducer";
import CardInDeck from "./Card";

interface CardsListProps {
  cards?: EnrichedCard[];
  format?: string;
}

export function CardsList({
  cards = [],
  format = CHAMPIONSHIP_FORMAT,
}: CardsListProps) {
  const dispatch = useDeckBuilderDispatcher();
  return (
    <>
      {cards.map((card, i) => (
        <CardInDeck
          cardId={card.id}
          withAnimation
          inDeck
          format={format}
          key={card.id}
          toggleCard={() => dispatch(toggleCardAction(card))}
          isAlter={i % 2 === 0}
        />
      ))}
    </>
  );
}
