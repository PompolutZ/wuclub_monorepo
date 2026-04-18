import { useInfiniteQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono/client";
import { Deck, FactionName } from "@fxdxpz/wudb";
import { api } from "../../services/api";
import { PUBLIC_DECKS_KEY } from "../../services/queryKeys";

const IsDecksResponse = (
  data: InferResponseType<typeof api.v2.decks.$get>,
): data is { decks: Deck[]; total: number } => "total" in data;

const DECKS_BATCH_SIZE = 30;

export const useQueryDecks = (faction?: FactionName | "all") => {
  return useInfiniteQuery({
    queryKey: [PUBLIC_DECKS_KEY, { faction: faction ?? "all" }],
    queryFn: async ({ pageParam: { limit, skip, faction } }) => {
      const res = await api.v2.decks.$get({
        query: {
          // FactionName (@fxdxpz/wudb) and factionsSchema (@fxdxpz/schema)
          // have drifted (e.g. "eyes-of-the-nine" vs "the-eyes-of-the-nine");
          // the backend accepts the string either way. Cast until reconciled.
          faction: (faction === "all" ? undefined : faction) as never,
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
