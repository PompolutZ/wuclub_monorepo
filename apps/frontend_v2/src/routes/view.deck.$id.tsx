import { createFileRoute } from "@tanstack/react-router";
import Deck from "../pages/Deck";
import { deckQueryOptions } from "../pages/Deck/queries";

export const Route = createFileRoute("/view/deck/$id")({
  loader: ({ params, context }) =>
    context.queryClient.ensureQueryData(deckQueryOptions(params.id)),
  component: Deck,
});
