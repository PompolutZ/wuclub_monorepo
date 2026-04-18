import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const AdminPage = lazy(() => import("../../pages/Admin"));

export const Route = createFileRoute("/_admin/admin")({
  component: AdminPage,
});
