import { getOrCreateClient } from "@/dal/client";
import { Deck } from "@fxdxpz/schema";

export const getDeckById = async (deckId: string) => {
  const client = await getOrCreateClient();
  const payload = await client
    .collection("decks")
    .findOne({ deckId }, { projection: { _id: 0 } });

  return payload as unknown as Deck;
};
