import { createFileRoute } from "@tanstack/react-router";
import { FactionName } from "@fxdxpz/wudb";
import Decks from "../pages/Decks";
import { decksQueryOptions } from "../pages/Decks/useDecksQuery";

export const Route = createFileRoute("/decks/$faction")({
  // Warm the query cache on hover (via defaultPreload: "intent") without
  // blocking navigation. The page uses useSuspenseInfiniteQuery, so a cold
  // navigation suspends into the root Suspense boundary instead of freezing
  // on the previous page.
  loader: ({ params, context }) => {
    void context.queryClient.prefetchInfiniteQuery(
      decksQueryOptions(params.faction as FactionName | "all"),
    );
  },
  component: Decks,
});
