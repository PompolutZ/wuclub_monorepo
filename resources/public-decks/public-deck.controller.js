import { connect, DATABASE_NAME, DECKS } from "../../utils/db.js";

export async function getAllPublicDecks(req, res) {
  let connection;
  let cursor;
  try {
    connection = await connect();
    cursor = await connection
      .db(DATABASE_NAME)
      .collection(DECKS)
      .find({ private: false }, { projection: { _id: 0, fuid: 0, private: 0,  }});

    const payload = await cursor.limit(20).toArray();
    return res.status(200).json(payload);  
  } catch (e) {
    console.error(e);
  } finally {
    cursor.close();
    connection.close();
  }
}

export async function getPublicDecksStats(req, res) {
    let connection; 
    try {
        connection = await connect();
        const payload = await connection
            .db(DATABASE_NAME)
            .collection(DECKS)
            .aggregate([
                { $match: { private: false } },
                { $group: { _id: '$faction', count: { $sum: 1 }} },
            ]).toArray();
            
        return res.status(200).json(payload);
    } catch (e) {
        console.error(e);
    } finally {
        connection.close();
    }
}
