import { Document } from "mongodb";
import { getOrCreateClient } from "@/dal/client";
import { GetAllDecksQuery } from "@/app/routes/decks/schemas";

export const getAllDecks = async (options: GetAllDecksQuery) => {
  try {
    const client = await getOrCreateClient();

    const pipe = buildPipeline(options);
    const decksSlice = [
      ...pipe,
      { $skip: options.skip },
      { $limit: options.limit },
      { $project: { _id: 0 } },
    ];
    const totalCount = [...pipe, { $count: "total" }];

    const [decks, [{ total }]] = await Promise.all([
      client.collection("decks").aggregate(decksSlice).toArray(),
      client.collection("decks").aggregate(totalCount).toArray(),
    ]);

    return { decks, total };
  } catch (error) {
    console.error("ERROR", error);
    return [];
  }
};

function buildPipeline({ faction }: GetAllDecksQuery) {
  const pipe: Document[] = [];
  pipe.push({
    $match: {
      private: false,
      faction: faction || { $exists: true },
    },
  });

  pipe.push({
    $sort: { updatedutc: -1 },
  });

  return pipe;
}
