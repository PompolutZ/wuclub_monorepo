import { decks } from "../../utils/db.js";
import { sanitizeString } from "../../utils/utils.js";

export async function getAllPublicDecks(req, res) {
  let cursor;
  try {
    let { faction } = req.body;
    console.log(faction, req.body);
    if (faction) {
      cursor = decks().find(
        { private: false, faction: sanitizeString(faction) },
        { projection: { _id: 0, fuid: 0, private: 0 } }
      ).sort({ updatedutc: -1 });
    } else {
      cursor = decks().find(
        { private: false },
        { projection: { _id: 0, fuid: 0, private: 0 } }
      ).sort({ updatedutc: -1 }).skip(30).limit(30);
    }

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
