import { Request, Response } from "express";
import { getAllDecks as _getAllDecks } from "@/dal";
import { ZodError } from "zod";
import { GetAllDecksSchema } from "./schemas";

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
