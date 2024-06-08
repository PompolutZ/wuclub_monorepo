import { Request, Response } from "express";
import { User } from "@/types";
import { z } from "zod";
import { getUserByFuid } from "@/dal/users";

export const getUser = async (
  req: Request,
  res: Response<{ data: User } | { error: string }>,
) => {
  try {
    const uid = z.string().parse(req.params.uid);
    const user = await getUserByFuid(uid);
    if (uid !== user?.fuid) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    return res.json({ data: user });
  } catch (e) {
    console.error("Error in getUser:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
};
