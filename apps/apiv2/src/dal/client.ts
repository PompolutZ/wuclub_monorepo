import { Db, MongoClient } from "mongodb";

let dbClient: Db;

export const getOrCreateClient = async () => {
  if (dbClient) {
    return dbClient;
  }

  const uri = `mongodb+srv://fxdxpz:${process.env.DB_PASSWORD}@wunderworlds.yzomr.mongodb.net/wunderworlds?retryWrites=true&w=majority`;
  const client = new MongoClient(uri);
  await client.connect();
  dbClient = client.db(process.env.DATABASE_NAME);
  return dbClient;
};
