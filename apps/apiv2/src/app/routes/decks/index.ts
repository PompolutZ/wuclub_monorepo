import { Request, Response } from "express";
import { getAllDecks as _getAllDecks } from "@/dal";

export const getAllDecks = async (_: Request, res: Response) => {
  const decks = await _getAllDecks();
  res.json(decks);
};
