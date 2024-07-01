import { app as decks } from "@/app/routes/decks";
import { app as users } from "@/app/routes/users";
import { Hono } from "hono";

export const app = new Hono()
  .basePath("/v2")
  .route("/users", users)
  .route("/decks", decks);

export type AppRoutes = typeof app;

