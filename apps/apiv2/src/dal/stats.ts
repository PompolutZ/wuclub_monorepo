import { DeckStat } from "@fxdxpz/schema";
import { getOrCreateClient } from "./client";

export const getAllDeckStats = async () => {
  try {
    const client = await getOrCreateClient();
    return (await client
      .collection("decks")
      .aggregate([
        { $match: { private: false } },
        { $group: { _id: "$faction", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { _id: 0, faction: "$_id", count: 1 } },
      ])
      .toArray()) as DeckStat[];
  } catch (e) {
    console.error("getAllDeckStats error: ", e);
  }
};
