import { createFileRoute } from "@tanstack/react-router";
import BoardsPage from "../pages/Boards";

export const Route = createFileRoute("/boards")({
  component: BoardsPage,
});
