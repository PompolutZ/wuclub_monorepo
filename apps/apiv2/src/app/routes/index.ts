import { Router } from "express";
import { getAllDecks } from "./decks";
import { verifyJwt } from "../middlewares/authentication";

const router = Router();

router.get("/decks", getAllDecks);
router.get("/decks/:id", verifyJwt, (req, res) => {
  res.json({ id: req.params.id });
});

export { router };
