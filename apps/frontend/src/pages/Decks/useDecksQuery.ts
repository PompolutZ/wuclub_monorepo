import { InferResponseType } from "hono/client";
import { api } from "../../services/api";
import { Deck, Factions } from "@fxdxpz/schema";
import { useInfiniteQuery } from "@tanstack/react-query";

const IsDecksResponse = (
  data: InferResponseType<typeof api.v2.decks.$get>,
): data is { decks: Deck[]; total: number } => "total" in data;

const DECKS_BATCH_SIZE = 30;

export const useQueryDecks = (faction?: Factions) => {
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
