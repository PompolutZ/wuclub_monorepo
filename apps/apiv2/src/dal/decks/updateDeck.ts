import { getOrCreateClient } from "@/dal/client";
import { DeckPayload } from "@fxdxpz/schema";

export const updateDeck = async (
  deckId: string,
  fuid: string,
  deck: DeckPayload,
) => {
  const client = await getOrCreateClient();
  const payload = await client.collection("decks").findOneAndUpdate(
    { fuid, deckId },
    {
      $set: {
        ...deck,
        deckId,
        updatedutc: new Date().getTime(),
      },
    },
    { returnDocument: "after" },
  );

  return payload;
};
