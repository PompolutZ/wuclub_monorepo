import { connect, DATABASE_NAME, DECKS } from "../../utils/db.js";

export async function getAllPublicDecks(req, res) {
  let connection;
  let cursor;
  try {
    connection = await connect();
    console.log(connection);
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

export function getPublicDecksStats() {}
