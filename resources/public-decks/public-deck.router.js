import { Router } from "express";
import { getAllPublicDecks } from "./public-deck.controller.js";

const router = Router();

router.get('/', getAllPublicDecks);

export default router;