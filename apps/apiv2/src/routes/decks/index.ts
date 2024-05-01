import { Request, Response } from "express";

export const getAllDecks = async (_: Request, res: Response) => {
  res.status(200).send("Success");
};
