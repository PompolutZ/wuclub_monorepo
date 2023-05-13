import { Router } from "express";
import { getAllPublicDecks, getPublicDecksStats } from "./public-deck.controller.js";

const router = Router();

router.post('/', getAllPublicDecks);
router.get('/stats', getPublicDecksStats);

export default router;