import { queryOptions } from "@tanstack/react-query";
import { Deck } from "@fxdxpz/schema";
import Firebase from "../../firebase";
import { api } from "../../services/api";
import { offlineDB } from "../../services/db";

// Returned deck shape merges public-deck (API) and anon-deck (IndexedDB).
// Anon decks have no `fuid` — that's the signal they're owned by the
// current device, so the user can always edit/delete them.
export type ViewDeck = Deck | (Omit<Deck, "fuid"> & { fuid?: undefined });

export const deckQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["deck", id],
    queryFn: async (): Promise<ViewDeck> => {
      // IndexedDB first — anon users keep their decks locally, and the API
      // doesn't know about them. Lookup is instant; no network.
      const anon = await offlineDB.anonDecks.where("deckId").equals(id).first();
      if (anon) return anon as unknown as ViewDeck;

      const token = await Firebase.getTokenId().catch(() => null);
      const res = await api.v2.decks[":id"].$get(
        { param: { id } },
        token ? { headers: { authtoken: token } } : undefined,
      );
      if (!res.ok) throw new Error(`Failed to load deck ${id}`);
      return (await res.json()) as ViewDeck;
    },
  });
