import { Router } from "express";
import { getAllDecks, getDeckById } from "./decks";
import { verifyJwt } from "../middlewares/authentication";
import { getUser } from "./users/getUser";

const router = Router();

router.get("/decks", getAllDecks);
router.get("/decks/:id", verifyJwt, getDeckById);

router.get("/users/:uid", verifyJwt, getUser);

export { router };
