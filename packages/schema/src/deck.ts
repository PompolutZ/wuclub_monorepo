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

export const deckValiditySchema = z.object({
  nemesis: z.boolean(),
  rivals: z.boolean(),
});
export type DeckValidity = z.infer<typeof deckValiditySchema>;

export const deckSchema = deckPayloadSchema.extend({
  fuid: z.string(),
  createdutc: z.number(),
  updatedutc: z.number(),
  validity: deckValiditySchema.optional(),
});

export type DeckStat = {
  faction: Factions;
  count: number;
};

export type Deck = z.infer<typeof deckSchema>;
