import { Hono } from "hono";
import { app as users } from "@/app/routes/users";
import { app as decks } from "@/app/routes/decks";

const app = new Hono();
app.basePath("/v2").route("/users", users).route("/decks", decks);

export { app };
