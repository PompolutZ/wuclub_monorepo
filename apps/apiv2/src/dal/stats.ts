import { getOrCreateClient } from "./client";

export const getAllDeckStats = async () => {
  try {
    const client = await getOrCreateClient();
    return await client
      .collection("decks")
      .aggregate([
        { $match: { private: false } },
        { $group: { _id: "$faction", count: { $sum: 1 } } },
      ])
      .toArray();
  } catch (e) {
    console.error("getAllDeckStats error: ", e);
  }
};
