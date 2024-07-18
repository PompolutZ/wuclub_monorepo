import { getOrCreateClient } from "@/dal/client";

type GetAllUserDecksOptions = {
  fuid: string;
};

export const getAllUserDecks = async (options: GetAllUserDecksOptions) => {
  try {
    const client = await getOrCreateClient();
    const decks = await client
      .collection("decks")
      .aggregate([
        {
          $match: {
            fuid: options.fuid,
          },
        },
        {
          $sort: { updatedutc: -1 },
        },
        {
          $project: { _id: 0 },
        },
      ])
      .toArray();
    return decks;
  } catch (error) {
    console.error("ERROR", error);
    return [];
  }
};
