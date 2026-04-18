import { createFileRoute } from "@tanstack/react-router";
import Decks from "../pages/Decks";

export const Route = createFileRoute("/decks/$faction")({
  component: Decks,
});
