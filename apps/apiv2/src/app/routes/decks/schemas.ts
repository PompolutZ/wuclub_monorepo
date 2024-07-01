import { factionsSchema } from "@fxdxpz/schema";
import { z } from "zod";

export const getAllDecksSchema = z.object({
  faction: factionsSchema.optional(),
  skip: z.coerce.number().optional().default(0),
  limit: z.coerce.number().max(30).optional().default(30),
});

export type GetAllDecksQuery = z.infer<typeof getAllDecksSchema>;

export const DeckIdSchema = z.string().regex(/^[a-z]{2,7}-[a-z0-9]{12}$/);
export type DeckId = z.infer<typeof DeckIdSchema>;

export const updateDeckSchema = z.object({
  deck: z.array(z.number()),
  name: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[^\$\{\}\[\]";]+$/, { message: "Invalid characters" }),
  private: z.boolean(),
  sets: z.array(z.number()),
  updatedutc: z.number(),
});

export const newDeckSchema = z.object({
  ...updateDeckSchema.shape,
  deckId: DeckIdSchema,
  createdutc: z.number(),
});

export type UpdateDeck = z.infer<typeof updateDeckSchema>;
export type NewDeck = z.infer<typeof newDeckSchema>;
