import { createFileRoute } from "@tanstack/react-router";
import Deck from "../pages/Deck";
import { deckQueryOptions } from "../pages/Deck/queries";

export const Route = createFileRoute("/view/deck/$id")({
  // Warm the cache on hover (via defaultPreload: "intent") without blocking
  // navigation. The page uses useSuspenseQuery, so a cold navigation suspends
  // into the root Suspense boundary instead of freezing on the previous page.
  loader: ({ params, context }) => {
    void context.queryClient.prefetchQuery(deckQueryOptions(params.id));
  },
  component: Deck,
});
