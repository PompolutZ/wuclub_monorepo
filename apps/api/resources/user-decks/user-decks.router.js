import { Router } from "express";
import { verifyFirebaseToken } from "../../middleware/firebase/fbadmin.js";
import { createDeck, deleteDeck, getAllDecks, getDeckById, updateDeck } from "./user-decks.controller.js";

const router = Router();

router.get('/', verifyFirebaseToken, getAllDecks);
router.post('/', verifyFirebaseToken, createDeck);

router.get('/:id', verifyFirebaseToken, getDeckById);
router.put('/:id', verifyFirebaseToken, updateDeck)
router.delete('/:id', verifyFirebaseToken, deleteDeck)

export default router;