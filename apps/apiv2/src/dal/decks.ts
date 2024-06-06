import { ObjectId, Document } from "mongodb";
import { getOrCreateClient } from "./client";
import { GetAllDecksQuery } from "../app/routes/decks/schemas";

export type User = {
  _id: ObjectId;
  fuid: string;
  avatar: string;
  displayName: string;
  role: string[];
};

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

  if (faction) {
    pipe.push({
      $match: {
        private: false,
        faction,
      },
    });
  } else {
    pipe.push({
      $match: {
        private: false,
      },
    });
  }

  pipe.push({
    $sort: { updatedutc: -1 },
  });

  if (skip) {
    pipe.push({
      $skip: skip,
    });
  } else {
    pipe.push({
      $skip: 0,
    });
  }

  if (limit) {
    pipe.push({
      $limit: limit,
    });
  } else {
    pipe.push({
      $limit: 30,
    });
  }

  return pipe;
}
