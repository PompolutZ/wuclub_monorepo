import { useQuery, useQueryClient } from "@tanstack/react-query";
import Firebase from "../../firebase";
import { api } from "../../services/api";
import { offlineDB } from "../../services/db";
import useAuthUser from "../../hooks/useAuthUser";
import { Deck } from "@fxdxpz/schema";

export const useUserDecksQuery = () => {
  const user = useAuthUser();
  return useQuery({
    queryKey: ["userDecks", { user: user?.fuid ?? "anon" }],
    queryFn: async () => {
      if (!user) {
        const offlineDecks = await offlineDB.anonDecks.toArray();
        return offlineDecks.toSorted((x, y) => y.updatedutc - x.updatedutc);
      }

      const token = await Firebase.getTokenId();
      if (token) {
        const res = await api.v2.users.decks.$get(undefined, {
          headers: {
            authtoken: token,
          },
        });

        return res.json() as unknown as Deck[];
      }
    },
  });
};

// I am not sure if we even need this hook at all.
export const useUserDeck = (deckId: string) => {
  const { fuid } = useAuthUser();
  const { getQueryCache } = useQueryClient();

  const user = fuid ?? "anon";
  const decksQueryKey = ["userDecks", { user }];
  const deckQueryKey = ["userDeck", { deckId }];
  let initialData: Deck;
  const isDeckInCache =
    getQueryCache().find<Deck>({ queryKey: deckQueryKey }) !== undefined;

  if (!isDeckInCache) {
    const cachedDecksQuery = getQueryCache().find<Deck[]>({
      queryKey: decksQueryKey,
    });
    if (typeof cachedDecksQuery !== "undefined") {
      const cachedDeck = cachedDecksQuery.state.data?.find(
        (d) => d.deckId === deckId,
      );
      if (typeof cachedDeck !== "undefined") {
        initialData = cachedDeck;
      }
    }
  }

  return useQuery({
    queryKey: deckQueryKey,
    queryFn: async () => {
      if (!user) {
        return await offlineDB.anonDecks.where("deckId").equals(deckId).first();
      }

      // const token = await Firebase.getTokenId();

      return initialData;
    },
    initialData: () => initialData,
  });
};
