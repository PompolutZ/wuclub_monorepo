import { getOrCreateClient } from "@/dal/client";
import { DeckPayload } from "@fxdxpz/schema";
import { computeDeckValidity } from "@fxdxpz/wudb";

export const updateDeck = async (
  deckId: string,
  fuid: string,
  deck: Partial<DeckPayload>,
) => {
  const client = await getOrCreateClient();
  const validity = deck.deck ? computeDeckValidity(deck.deck) : undefined;
  const payload = await client.collection("decks").findOneAndUpdate(
    { fuid, deckId },
    {
      $set: {
        ...deck,
        deckId,
        updatedutc: new Date().getTime(),
        ...(validity ? { validity } : {}),
      },
    },
    { returnDocument: "after" },
  );

  return payload;
};
