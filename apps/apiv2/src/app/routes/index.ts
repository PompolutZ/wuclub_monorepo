import { Router } from "express";
import {
  createDeck,
  deleteDeck,
  getAllDecks,
  getAllUsersDecks,
  getDeckById,
  updateDeck,
} from "./decks";
import { verifyJwt } from "../middlewares/authentication";
import { getUser } from "./users/getUser";
import { upsertUser } from "./users/upsertUser";

const publicRouter = Router();
publicRouter.get("/decks", getAllDecks);

const privateRouter = Router();
privateRouter.use(verifyJwt);

privateRouter.get("/decks/:id", getDeckById);
privateRouter.put("/decks/:id", updateDeck);
privateRouter.delete("/decks/:id", deleteDeck);

privateRouter.post("/users", upsertUser);
privateRouter.get("/users/:uid", getUser);
privateRouter.get("/users/:uid/decks", getAllUsersDecks);
privateRouter.post("/users/:uid/decks", createDeck);

export { publicRouter, privateRouter };
