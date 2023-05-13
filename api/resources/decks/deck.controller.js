import { decks } from "../../utils/db.js";
import { validateDeckId } from "../../utils/validator.js";

export async function getPublicDeckById(req, res) {
    try {
        const { id } = req.params;
        const deckId = validateDeckId(id);
        if (!deckId) {
            return res.status(400).send('Invalid deck id.');
        }
        const deck = await decks().findOne({ deckId }, { projection: { _id: 0 }})
        if (deck.private) {
            return res.status(401).send('Cannot read private deck');
        }

        return res.status(200).json(deck);
    } catch(e) {
        console.error(e);
    } 
}

export async function getPrivateDeckById(req, res) {
    try {
        const { id } = req.params;
        const deckId = validateDeckId(id);
        if (!deckId) {
            return res.status(400).send('Invalid deck id.');
        }
        
        const deck = await decks().findOne({ deckId, fuid: req.firebaseUID }, { projection: { _id: 0 }});

        return res.status(200).json(deck);
    } catch(e) {
        console.error(e);
    }
}
