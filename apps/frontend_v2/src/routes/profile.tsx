import { createFileRoute } from "@tanstack/react-router";
import UserProfile from "../pages/UserProfile";

export const Route = createFileRoute("/profile")({
  component: UserProfile,
});
