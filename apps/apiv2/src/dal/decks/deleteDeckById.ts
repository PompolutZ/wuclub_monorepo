import { getOrCreateClient } from "@/dal/client";

export const deleteDeckById = async (deckId: string, fuid: string) => {
  const client = await getOrCreateClient();
  const payload = await client.collection("decks").deleteOne({ deckId, fuid });

  return payload;
};
