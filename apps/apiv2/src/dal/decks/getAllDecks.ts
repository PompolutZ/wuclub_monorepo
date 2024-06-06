import { Document } from "mongodb";
import { getOrCreateClient } from "@/dal/client";
import { GetAllDecksQuery } from "@/app/routes/decks/schemas";

export const getAllDecks = async (options: GetAllDecksQuery) => {
  try {
    const pipe = buildPipeline(options);
    const client = await getOrCreateClient();
    const decks = await client.collection("decks").aggregate(pipe).toArray();
    return decks;
  } catch (error) {
    console.error("ERROR", error);
    return [];
  }
};

function buildPipeline({ faction, skip, limit }: GetAllDecksQuery) {
  const pipe: Document[] = [];

  pipe.push({
    $lookup: {
      from: "users",
      localField: "fuid",
      foreignField: "fuid",
      as: "userInfo",
    },
  });

  pipe.push({
    $project: {
      _id: 0,
      fuid: 0,
      "userInfo._id": 0,
      "userInfo.role": 0,
      "userInfo.fuid": 0,
    },
  });

  pipe.push({
    $match: {
      private: false,
      faction: faction || { $exists: true },
    },
  });

  pipe.push({
    $sort: { updatedutc: -1 },
  });

  pipe.push({
    $skip: skip,
  });

  pipe.push({
    $limit: limit,
  });

  return pipe;
}
