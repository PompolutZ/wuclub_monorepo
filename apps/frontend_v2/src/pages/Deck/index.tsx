import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { getCardById } from "@fxdxpz/wudb";
import type { CardId } from "@fxdxpz/wudb";
import useAuthUser from "../../hooks/useAuthUser";
import ReadonlyDeck from "./ReadonlyDeck";
import { deckQueryOptions } from "./queries";

const route = getRouteApi("/view/deck/$id");

const Deck2 = () => {
  const { id } = route.useParams();
  const { data: deck } = useSuspenseQuery(deckQueryOptions(id));
  const user = useAuthUser() as { uid?: string } | null;

  const cards = deck.deck.map((cardId) => getCardById(cardId as CardId));
  const factionId = deck.deckId.split("-")[0];
  // Anon-owned decks (no fuid) are always editable by the device that holds
  // them; server-owned decks need uid match.
  const canUpdateOrDelete = deck.fuid ? user?.uid === deck.fuid : true;

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col">
        <ReadonlyDeck
          id={deck.deckId}
          name={deck.name}
          factionId={factionId}
          faction={deck.faction as never}
          cards={cards}
          sets={deck.sets as never[]}
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
