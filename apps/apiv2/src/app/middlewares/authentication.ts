import { Request, Response, NextFunction } from "express";
import { auth } from "../services/firebase";
import { ApiRequest } from "../../types";

export const verifyJwt = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.headers.authtoken) {
      const token = req.headers.authtoken as string;
      const decoded = await auth.verifyIdToken(token);
      if (!decoded) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      (req as ApiRequest).claims = decoded;
    }
    next();
  } catch (e) {
    console.error("Error in verifyJwt:", e);
    return res.status(401).json({ error: "Unauthorized" });
  }
};
