import { Deck } from "@fxdxpz/schema";
import { useLocation } from "@tanstack/react-router";
import { getCardById } from "@fxdxpz/wudb";
import type { CardId } from "@fxdxpz/wudb";
import ReadonlyDeck from "./ReadonlyDeck";

const Deck2 = () => {
  const state = useLocation({
    select: (loc) =>
      loc.state as unknown as
        | { deck: Deck; canUpdateOrDelete: boolean }
        | undefined,
  });

  // During navigation away from this route, TanStack Router briefly re-renders
  // with the incoming location's state, which may not match our shape.
  if (!state?.deck?.deck || !Array.isArray(state.deck.deck)) return null;

  const deck = state.deck;
  const cards = state.deck.deck.map((id) => getCardById(id as CardId));
  const factionId = state.deck.deckId.split("-")[0];
  const canUpdateOrDelete = state.canUpdateOrDelete;

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col">
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
