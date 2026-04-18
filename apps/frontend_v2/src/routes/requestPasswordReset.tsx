import { createFileRoute } from "@tanstack/react-router";
import PasswordResetRequest from "../pages/PasswordResetRequest";

export const Route = createFileRoute("/requestPasswordReset")({
  component: PasswordResetRequest,
});
