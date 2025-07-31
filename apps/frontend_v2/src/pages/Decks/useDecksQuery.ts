import { useInfiniteQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono/client";
import { Deck, FactionName } from "../../data/wudb/types";
import { api } from "../../services/api";

const IsDecksResponse = (
  data: InferResponseType<typeof api.v2.decks.$get>,
): data is { decks: Deck[]; total: number } => "total" in data;

const DECKS_BATCH_SIZE = 30;

export const useQueryDecks = (faction?: FactionName | "all") => {
  return useInfiniteQuery({
    queryKey: ["decks2", { faction: faction ?? "all" }],
    queryFn: async ({ pageParam: { limit, skip, faction } }) => {
      const res = await api.v2.decks.$get({
        query: {
          faction,
          limit: limit?.toString(),
          skip: skip?.toString(),
          edition: "2",
        },
      });

      return res.json() as Promise<{
        decks: Deck[];
        total: number;
      }>;
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
