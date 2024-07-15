import { getOrCreateClient } from "@/dal/client";
import { DeckPayload } from "@fxdxpz/schema";

export const createNewDeck = async (deck: DeckPayload, fuid: string) => {
  const client = await getOrCreateClient();
  const now = new Date().getTime();
  const payload = await client.collection("decks").insertOne({
    ...deck,
    fuid,
    createdutc: now,
    updatedutc: now,
  });

  return payload;
};
