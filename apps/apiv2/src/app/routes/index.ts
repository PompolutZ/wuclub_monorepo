import { Router } from "express";
import { getAllDecks } from "./decks";
import { verifyJwt } from "../middlewares/authentication";
import { ApiRequest } from "../../types";

export * from "./decks";

const router = Router();

router.get("/decks", getAllDecks);
router.get("/decks/:id", verifyJwt, (req: ApiRequest, res) => {
  res.json({ id: req.params.id });
});

export { router };
