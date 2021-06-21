import { Router } from "express";
import { getAllPublicDecks, getPublicDecksStats } from "./public-deck.controller.js";

const router = Router();

router.get('/', getAllPublicDecks);
router.get('/stats', getPublicDecksStats);

export default router;