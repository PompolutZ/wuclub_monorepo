import { getOrCreateClient } from "@/dal/client";
import { NewDeck } from "../../app/routes/decks/schemas";

export const createNewDeck = async (deck: NewDeck, fuid: string) => {
  const client = await getOrCreateClient();
  const payload = await client.collection("decks").insertOne({
    ...deck,
    fuid,
  });

  return payload;
};
