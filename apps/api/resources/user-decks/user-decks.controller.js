import { decks } from "../../utils/db.js";
import { sanitizeNumbersArray, sanitizeString } from "../../utils/utils.js";
import { validateDeckId } from "../../utils/validator.js";

export async function getAllDecks(req, res) {
  try {
    const payload = await decks()
      .aggregate([
        {
          $match: {
            fuid: req.firebaseUID,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "fuid",
            foreignField: "fuid",
            as: "userInfo",
          },
        },
        {
          $sort: {
            updatedutc: -1,
          },
        },
        {
          $project: {
            _id: 0,
            fuid: 0,
            "userInfo._id": 0,
            "userInfo.role": 0,
            "userInfo.fuid": 0,
          },
        },
      ])
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
    console.log("Save deck", req.body);
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
      const { deckId, deck, faction, name, sets, createdutc, updatedutc } =
        payload;
      return res.status(201).send({
        deckId,
        deck,
        faction,
        name,
        sets,
        createdutc,
        updatedutc,
        private: payload.private,
      });
    } else {
      return res.status(500).send("Cannot create deck.");
    }
  } catch (e) {
    console.error(e);
  }
}

export async function updateDeck(req, res) {
  try {
    const deckId = validateDeckId(req.params.id);
    if (!deckId) {
      return res.status(400).send("Deck missing id.");
    }

    const now = new Date();

    const deckToUpload = {
      name: sanitizeString(req.body.name),
      deck: sanitizeNumbersArray(req.body.deck),
      private: Boolean(req.body.private),
      sets: sanitizeNumbersArray(req.body.sets),
      updatedutc: now.getTime(),
    };

    const result = await decks().findOneAndUpdate(
      { fuid: req.firebaseUID, deckId },
      { $set: deckToUpload },
      { projection: { _id: 0, fuid: 0 } }
    );
    return res.send(result.value);
  } catch (e) {
    console.error(e);
  }
}

export async function deleteDeck(req, res) {
  try {
    const deckId = validateDeckId(req.params.id);
    if (!deckId) {
      return res.status(400).send("Deck missing id.");
    }

    const result = await decks().deleteOne({ fuid: req.firebaseUID, deckId });
    return res.status(204).send(result);
  } catch (e) {
    console.error(e);
  }
}
