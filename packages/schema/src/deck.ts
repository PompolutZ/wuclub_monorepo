import { z } from "zod";
import { Factions } from "./factions";

// Deck payload is used to post a new deck, since some of the
// deck properties will be generated server-side.
export const deckPayloadSchema = z
  .object({
    deckId: z.string(),
    deck: z.array(z.union([z.number(), z.string()])),
    faction: z.string(),
    name: z.string(),
    private: z.boolean(),
    sets: z.array(z.string()),
    edition: z.coerce.number().optional(),
  })
  .describe(
    "Deck payload is used to post a new deck, since some of the deck properties will be generated server-side.",
  );

export type DeckPayload = z.infer<typeof deckPayloadSchema>;
export const deckSchema = deckPayloadSchema.extend({
  fuid: z.string(),
  createdutc: z.number(),
  updatedutc: z.number(),
});

export type DeckStat = {
  faction: Factions;
  count: number;
};

export type Deck = z.infer<typeof deckSchema>;
