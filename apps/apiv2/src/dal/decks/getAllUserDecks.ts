import { getOrCreateClient } from "@/dal/client";

type GetAllUserDecksOptions = {
  skip: number;
  limit: number;
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
          $skip: options.skip,
        },
        {
          $limit: options.limit,
        },
        {
          $lookup: {
            from: "users",
            localField: "fuid",
            foreignField: "fuid",
            as: "userInfo",
          },
        },
        {
          $project: {
            _id: 0,
            fuid: 0,
            "userInfo._id": 0,
            "userInfo.role": 0,
            "userInfo.fuid": 0,
          },
        },
      ])
      .toArray();
    return decks;
  } catch (error) {
    console.error("ERROR", error);
    return [];
  }
};
