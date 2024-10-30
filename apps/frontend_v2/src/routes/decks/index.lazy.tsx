import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/decks/")({
  component: () => <div>Hello /decks/!</div>,
});
