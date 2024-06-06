import { Router } from "express";
import { getAllDecks, getDeckById } from "./decks";
import { verifyJwt } from "../middlewares/authentication";

const router = Router();

router.get("/decks", getAllDecks);
router.get("/decks/:id", verifyJwt, getDeckById);

export { router };
