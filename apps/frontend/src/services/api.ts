import { Factions } from "@fxdxpz/schema";
import { useQuery } from "@tanstack/react-query";
import { hc } from "hono/client";
import { AppRoutes } from "./app";

const api = hc<AppRoutes>("http://localhost:8181");

export const useQueryDecks = (
  faction?: Factions,
  limit?: number,
  skip?: number,
) => {
  return useQuery({
    queryKey: ["decks", { faction, limit, skip }],
    queryFn: async () => {
      const res = await api.v2.decks.$get({
        query: {
          faction,
          limit: limit?.toString(),
          skip: skip?.toString(),
        },
      });

      return res.json();
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
