import { Router } from "express";
import { getAllDecks } from "./decks";

export * from "./decks";

const router = Router();
router.get("/decks", getAllDecks);

export { router };
