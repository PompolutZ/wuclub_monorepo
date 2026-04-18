import { createFileRoute } from "@tanstack/react-router";
import Library from "../pages/Library/Library";

export const Route = createFileRoute("/library")({
  component: Library,
});
