import { createFileRoute } from "@tanstack/react-router";
import Card from "../pages/Card";

export const Route = createFileRoute("/view/card/$id")({
  component: Card,
});
