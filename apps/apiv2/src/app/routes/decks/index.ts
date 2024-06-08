import { Request, Response } from "express";
import {
  getAllDecks as _getAllDecks,
  getDeckById as _getDeckById,
} from "@/dal";
import { ZodError } from "zod";
import { DeckIdSchema, GetAllDecksSchema } from "./schemas";
import { ApiRequest } from "../../../types";

export const getAllDecks = async (req: Request, res: Response) => {
  try {
    const query = GetAllDecksSchema.parse(req.query);
    const decks = await _getAllDecks(query);
    res.json(decks);
  } catch (e) {
    console.error("Error in getAllDecks:", e);
    if (e instanceof ZodError) {
      res.status(400).json({ error: e.errors });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const getDeckById = async (req: ApiRequest, res: Response) => {
  try {
    const deckId = DeckIdSchema.parse(req.params.id);
    const deck = await _getDeckById(deckId);

    if (!deck) {
      return res.status(404).json({ error: "Deck not found" });
    }

    if (deck.private && deck.fuid !== req.user?.fuid) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    return res.json(deck);
  } catch (e) {
    console.error("Error in getDeckById:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
};
