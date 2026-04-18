import { createFileRoute } from "@tanstack/react-router";
import MyDecks from "../pages/MyDecks";

export const Route = createFileRoute("/mydecks")({
  component: MyDecks,
});
