import { createFileRoute } from "@tanstack/react-router";
import { FactionName } from "@fxdxpz/wudb";
import Decks from "../pages/Decks";
import { decksQueryOptions } from "../pages/Decks/useDecksQuery";

export const Route = createFileRoute("/decks/$faction")({
  loader: ({ params, context }) =>
    context.queryClient.ensureInfiniteQueryData(
      decksQueryOptions(params.faction as FactionName | "all"),
    ),
  component: Decks,
});
