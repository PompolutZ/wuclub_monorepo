import { getOrCreateClient } from "@/dal/client";
import { UpdateDeck } from "../../app/routes/decks/schemas";

export const updateDeck = async (
  deckId: string,
  fuid: string,
  deck: UpdateDeck,
) => {
  const client = await getOrCreateClient();
  const payload = await client.collection("decks").findOneAndUpdate(
    { fuid, deckId },
    {
      $set: {
        ...deck,
        updatedutc: new Date().getTime(),
      },
    },
    { returnDocument: "after" },
  );

  console.log(payload);

  return payload;
};
