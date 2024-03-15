import { decks } from "../../utils/db.js";
import { sanitizeString } from "../../utils/utils.js";

function buildPipeline({ faction, skip, limit } = {}) {
  const pipe = [];

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

export async function getAllPublicDecks(req, res) {
  let cursor;
  try {
    let { faction, skip, limit } = req.body;
    if (faction) {
      faction = sanitizeString(faction);
    }

    const pipeline = buildPipeline({
      faction,
      skip: Number(skip),
      limit: Number(limit),
    });

    cursor = decks().aggregate(pipeline);
    const payload = await cursor.toArray();
    return res.status(200).json(payload);
  } catch (e) {
    console.error(e);
  } finally {
    cursor.close();
  }
}

export async function getPublicDecksStats(req, res) {
  try {
    const payload = await decks()
      .aggregate([
        { $match: { private: false } },
        { $group: { _id: "$faction", count: { $sum: 1 } } },
      ])
      .toArray();

    return res.status(200).json(payload);
  } catch (e) {
    console.error(e);
  }
}
