import { Factions } from "@fxdxpz/schema";
import { useQuery } from "@tanstack/react-query";
import { hc } from "hono/client";
import { AppRoutes } from "./";

const api = hc<AppRoutes>("http://localhost:8181");

export const useQueryDecks = (
  faction?: Factions,
  limit?: number,
  skip?: number,
) => {
  return useQuery({
    queryKey: ["decks", { faction, limit, skip }],
    queryFn: () =>
      api.v2.decks.$get({
        query: {
          faction,
          limit: limit?.toString(),
          skip: skip?.toString(),
        },
      }),
  });
};
