import { connect, DATABASE_NAME, DECKS } from "../../utils/db.js";
import { validateDeckId } from "../../utils/validator.js";

export async function getPublicDeckById(req, res) {
    let connection;
    try {
        connection = await connect();
        const { id } = req.params;
        const deckId = validateDeckId(id);
        if (!deckId) {
            return res.status(400).send('Invalid deck id.');
        }
        const deck = await connection.db(DATABASE_NAME).collection(DECKS).findOne({ deckId }, { projection: { _id: 0 }})
        if (deck.private) {
            return res.status(401).send('Cannot read private deck');
        }

        return res.status(200).json(deck);
    } catch(e) {
        console.error(e);
    } finally {
        connection.close();
    }
}

export async function getPrivateDeckById(req, res) {
    let connection;
    try {
        connection = await connect();
        const { id } = req.params;
        const deckId = validateDeckId(id);
        if (!deckId) {
            return res.status(400).send('Invalid deck id.');
        }
        
        const deck = await connection.db(DATABASE_NAME).collection(DECKS).findOne({ deckId, fuid: req.firebaseUID }, { projection: { _id: 0 }});

        return res.status(200).json(deck);
    } catch(e) {
        console.error(e);
    } finally {
        connection.close();
    }
}

export async function createDeck(req, res) {
    console.log('Before post', req);
    return res.send('Ok');
}