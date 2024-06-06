import { z } from "zod";

export const deckSchema = z.object({
  deckId: z.string(),
  fuid: z.string(),
  deck: z.array(z.number()),
  faction: z.string(),
  name: z.string(),
  private: z.boolean(),
  sets: z.array(z.number()),
  createdutc: z.number(),
  updatedutc: z.number(),
});

export type Deck = z.infer<typeof deckSchema>;
