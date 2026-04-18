import { createFileRoute } from "@tanstack/react-router";
import Deck from "../pages/Deck";

export const Route = createFileRoute("/view/deck/$id")({
  component: Deck,
});
