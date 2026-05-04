import { createFileRoute } from "@tanstack/react-router";
import RoomPage from "../pages/Room";

export const Route = createFileRoute("/room/$id")({
  component: RoomPage,
});
