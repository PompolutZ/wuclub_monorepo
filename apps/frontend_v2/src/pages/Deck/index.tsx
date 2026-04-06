import { Deck } from "@fxdxpz/schema";
import { useLocation } from "react-router-dom";
import { getCardById } from "@fxdxpz/wudb";
import type { CardId } from "@fxdxpz/wudb";
import ReadonlyDeck from "./ReadonlyDeck";

const Deck2 = () => {
  const { state } = useLocation<{ deck: Deck; canUpdateOrDelete: boolean }>();

  const deck = state.deck;
  const cards = state.deck.deck.map((id) => getCardById(id as CardId));
  const factionId = state.deck && state.deck.deckId.split("-")[0];
  const canUpdateOrDelete = state.canUpdateOrDelete;

  if (!deck) return null;

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1">
        <ReadonlyDeck
          id={deck.deckId}
          name={deck.name}
          factionId={factionId}
          faction={deck.faction as any}
          cards={cards}
          sets={deck.sets as any[]}
          createdutc={deck.createdutc}
          updatedutc={deck.updatedutc}
          private={deck.private}
          canUpdateOrDelete={canUpdateOrDelete}
        />
      </div>
    </div>
  );
};

export default Deck2;
