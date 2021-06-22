import { decks } from "../../utils/db.js";
import { validateDeckId } from "../../utils/validator.js";

export async function getAllDecks(req, res) {
    try {
        const payload = await decks().find({ fuid: req.firebaseUID, }, { projection: { _id: 0 } }).toArray();
        return res.json(payload);
    } catch (e) {
        console.error('user-decks.getAllDecks', e);
    }
}

export async function getDeckById(req, res) {
    try {
        const deckId = validateDeckId(req.params.id);
        if (!deckId) {
            return res.status(400).send('Badly formatted deck id.')
        }

        const payload = await decks().find({ fuid: req.firebaseUID, deckId }, { projection: { _id: 0 } }).toArray();
        return res.json(payload);
    } catch (e) {
        console.error('user-decks.getAllDecks', e);
    }
}