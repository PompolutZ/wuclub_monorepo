import { app as decks } from "@/app/routes/decks";
import { app as users } from "@/app/routes/users";
import { app as stats } from "@/app/routes/stats";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

export const app = new Hono()
  .basePath("/v2")
  .use("*", cors())
  .use(logger())
  .route("/users", users)
  .route("/decks", decks)
  .route("/stats", stats);

export type AppRoutes = typeof app;

