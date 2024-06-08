import { Response } from "express";
import { ApiRequest, User } from "@/types";
import { z } from "zod";

export const getUser = async (
  req: ApiRequest,
  res: Response<{ data: User } | { error: string }>,
) => {
  try {
    const uid = z.string().parse(req.params.uid);
    if (uid !== req.user?.fuid) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    return res.json({ data: req.user });
  } catch (e) {
    console.error("Error in getUser:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
};
