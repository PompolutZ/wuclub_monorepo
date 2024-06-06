import { Response, NextFunction } from "express";
import { auth } from "../services/firebase";
import { getUserByFuid } from "../../dal/users";
import { ApiRequest } from "../../types";

export const verifyJwt = async (
  req: ApiRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.headers.authtoken) {
      const token = req.headers.authtoken as string;
      const decoded = await auth.verifyIdToken(token);
      if (decoded?.uid) {
        req.user = await getUserByFuid(decoded.uid);
      }
    }
    next();
  } catch (e) {
    console.error("Error in verifyJwt:", e);
    return res.status(401).json({ error: "Unauthorized" });
  }
};
