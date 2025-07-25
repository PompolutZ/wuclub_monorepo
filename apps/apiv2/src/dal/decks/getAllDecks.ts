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

    const [decks, count] = await Promise.all([
      client.collection("decks").aggregate(decksSlice).toArray(),
      client.collection("decks").aggregate(totalCount).toArray(),
    ]);

    return { decks, total: count[0]?.total ?? 0 };
  } catch (error) {
    console.error("ERROR", error);
    return [];
  }
};
function buildPipeline({ faction, edition, fuid }: GetAllDecksQuery) {
  const pipe: Document[] = [];
  const matchConditions: Document = {
    faction: faction || { $exists: true },
    // missing edition means that deck was created for the first edition
    // but since we share db, we do not want to include decks with edition in
    // the requests made by the frontend
    edition: edition ? edition : { $exists: false }
  };

  if (fuid) {
    matchConditions.fuid = fuid;
  } else {
    matchConditions.private = false;
  }

  pipe.push({
    $match: matchConditions,
  });

  pipe.push({
    $sort: { updatedutc: -1 },
  });

  return pipe;
}
