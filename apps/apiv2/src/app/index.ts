import { app as decks } from "@/app/routes/decks";
import { app as users } from "@/app/routes/users";
import { app as stats } from "@/app/routes/stats";
import { Hono } from "hono";

export const app = new Hono()
  .basePath("/v2")
  .route("/users", users)
  .route("/decks", decks)
  .route("/stats", stats);

export type AppRoutes = typeof app;

