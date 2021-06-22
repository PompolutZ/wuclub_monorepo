import { Router } from "express";
import { verifyFirebaseToken } from "../../middleware/firebase/fbadmin.js";
import { getAllDecks, getDeckById } from "./user-decks.controller.js";

const router = Router();

router.get('/', verifyFirebaseToken, getAllDecks);
router.get('/:id', verifyFirebaseToken, getDeckById);

export default router;