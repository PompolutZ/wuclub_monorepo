import { Response } from "express";
import { ApiRequest, User } from "@/types";
import { z } from "zod";
import { factionsSchema } from "@fxdxpz/schema";
import { setUser } from "@/dal/users";

const updateUserSchema = z.object({
  displayName: z
    .string()
    .min(2)
    .max(50)
    .regex(/[a-zA-Z-0-9]+/),
  avatar: factionsSchema,
});

export const postUser = async (
  req: ApiRequest,
  res: Response<{ data: User } | { error: string }>,
) => {
  try {
    const payload = updateUserSchema.parse(req.body);
    const user = {
      ...payload,
      fuid: req.claims.uid,
      role: ["User"],
    };
    await setUser(user);
    return res.status(201).json({ data: user });
  } catch (e) {
    console.error("Error in postUser:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
};
