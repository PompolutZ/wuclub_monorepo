import { createFileRoute } from "@tanstack/react-router";
import SignUp from "../pages/SignUp";

export const Route = createFileRoute("/user/signup")({
  component: SignUp,
});
