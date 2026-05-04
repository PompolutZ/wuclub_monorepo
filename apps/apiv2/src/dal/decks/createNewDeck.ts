import { getOrCreateClient } from "@/dal/client";
import { DeckPayload } from "@fxdxpz/schema";
import { computeDeckValidity } from "@fxdxpz/wudb";

export const createNewDeck = async (deck: DeckPayload, fuid: string) => {
  const client = await getOrCreateClient();
  const now = new Date().getTime();
  const validity =
    deck.edition === 2 ? computeDeckValidity(deck.deck) : undefined;
  const payload = await client.collection("decks").insertOne({
    ...deck,
    fuid,
    createdutc: now,
    updatedutc: now,
    ...(validity ? { validity } : {}),
  });

  return payload;
};
