import { decks } from "../../utils/db.js";
import { sanitizeNumbersArray, sanitizeString } from "../../utils/utils.js";
import { validateDeckId } from "../../utils/validator.js";

export async function getAllDecks(req, res) {
  try {
    const payload = await decks()
      .find({ fuid: req.firebaseUID }, { projection: { _id: 0 } })
      .toArray();
    return res.json(payload);
  } catch (e) {
    console.error("user-decks.getAllDecks", e);
  }
}

export async function getDeckById(req, res) {
  try {
    const deckId = validateDeckId(req.params.id);
    if (!deckId) {
      return res.status(400).send("Badly formatted deck id.");
    }

    const payload = await decks()
      .find({ fuid: req.firebaseUID, deckId }, { projection: { _id: 0 } })
      .toArray();
    return res.json(payload);
  } catch (e) {
    console.error("user-decks.getAllDecks", e);
  }
}

export async function createDeck(req, res) {
  try {
    const deckId = validateDeckId(req.body.deckId);
    if (!deckId) {
      return res.status(400).send("Deck missing id.");
    }

    const now = new Date();

    const deckToUpload = {
      deckId,
      fuid: req.firebaseUID,
      deck: sanitizeNumbersArray(req.body.deck),
      faction: sanitizeString(req.body.faction),
      name: sanitizeString(req.body.name),
      private: Boolean(req.body.private),
      sets: sanitizeNumbersArray(req.body.sets),
      createdutc: now.getTime(),
      updatedutc: now.getTime(),
    };

    const result = await decks().insertOne(deckToUpload);
    const [payload] = result.ops;
    if (payload) {
        const {
            deckId, deck, faction, name, sets, createdutc, updatedutc
        } = payload;
        return res.status(201).send({
            deckId, deck, faction, name, sets, createdutc, updatedutc, private: payload.private,
        });
    } else {
        return res.status(500).send('Cannot create deck.')
    }
  } catch (e) {
    console.error(e);
  }
}
