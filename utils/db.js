import mongodb from "mongodb";
const MongoClient = mongodb.MongoClient;

export const DATABASE_NAME = "wunderworldsdb";
export const DECKS = "decks";

let connection;

export async function connect() {
    try {
        const uri = `mongodb+srv://fxdxpz:${process.env.DB_PASSWORD}@wunderworlds.yzomr.mongodb.net/wunderworlds?retryWrites=true&w=majority`;
        const client = new MongoClient(uri, {
            useUnifiedTopology: true
        });

        connection = await client.connect();
    } catch (e) {
        console.error('Connection error');
        console.error(e);
    }
}

const decks = () => {
    return connection.db(DATABASE_NAME).collection(DECKS);
}

export {
    decks,
}