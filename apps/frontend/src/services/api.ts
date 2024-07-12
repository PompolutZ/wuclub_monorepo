import { Deck, Factions } from "@fxdxpz/schema";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { hc, InferResponseType } from "hono/client";
import type { AppRoutes } from "./app";

const api = hc<AppRoutes>("http://localhost:8181");
const IsDecksResponse = (
  data: InferResponseType<typeof api.v2.decks.$get>,
): data is { decks: Deck[]; total: number } => "total" in data;

const DECKS_BATCH_SIZE = 10;

export const useQueryDecks = (faction?: Factions) => {
  console.log("Faction", faction);
  return useInfiniteQuery({
    queryKey: ["decks", { faction: faction ?? "all" }],
    queryFn: async ({ pageParam: { limit, skip, faction } }) => {
      const res = await api.v2.decks.$get({
        query: {
          faction,
          limit: limit?.toString(),
          skip: skip?.toString(),
        },
      });

      return res.json();
    },
    getNextPageParam: (lastPage, pages) => {
      if (
        IsDecksResponse(lastPage) &&
        lastPage.total < pages.length * DECKS_BATCH_SIZE
      ) {
        return undefined;
      }

      return {
        limit: DECKS_BATCH_SIZE,
        skip: pages.length * DECKS_BATCH_SIZE,
        faction,
      };
    },
    initialPageParam: {
      limit: DECKS_BATCH_SIZE,
      skip: 0,
      faction,
    },
  });
};

export const useDeckStats = () => {
  return useQuery({
    queryKey: ["deckStats"],
    queryFn: async () => {
      const res = await api.v2.stats.decks.$get();
      return res.json();
    },
  });
};
