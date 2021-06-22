import { decks } from "../../utils/db.js";

export async function getAllPublicDecks(req, res) {
  let cursor;
  try {
    cursor = decks()
      .find({ private: false }, { projection: { _id: 0, fuid: 0, private: 0,  }});

    const payload = await cursor.limit(20).toArray();
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
                { $group: { _id: '$faction', count: { $sum: 1 }} },
            ]).toArray();
            
        return res.status(200).json(payload);
    } catch (e) {
        console.error(e);
    } 
}
