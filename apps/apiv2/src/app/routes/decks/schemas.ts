import { factionsSchema } from "@fxdxpz/schema";
import { z } from "zod";

export const GetAllDecksSchema = z.object({
  faction: factionsSchema.optional(),
  skip: z.coerce.number().optional().default(0),
  limit: z.coerce.number().optional().default(30),
});

export type GetAllDecksQuery = z.infer<typeof GetAllDecksSchema>;
