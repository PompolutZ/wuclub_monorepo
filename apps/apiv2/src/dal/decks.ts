import { ObjectId, Document } from "mongodb";
import { getOrCreateClient } from "./client";

export type User = {
  _id: ObjectId;
  fuid: string;
  avatar: string;
  displayName: string;
  role: string[];
};

export type DecksPipelineOptions = {
  faction?: string;
  skip?: number;
  limit?: number;
};

export const getAllDecks = async () => {
  const pipe = buildPipeline({});
  const client = await getOrCreateClient();
  const decks = await client.collection("decks").aggregate(pipe).toArray();
  return decks;
};

function buildPipeline({ faction, skip, limit }: DecksPipelineOptions) {
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
