import { createFileRoute } from "@tanstack/react-router";
import DeckCreator from "../pages/DeckCreator";

export const Route = createFileRoute("/deck/$action")({
  component: DeckCreator,
});
