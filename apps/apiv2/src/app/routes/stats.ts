import { Hono } from "hono";
import { getAllDeckStats } from "../../dal/stats";
import { HTTPException } from "hono/http-exception";

export const app = new Hono().get("/decks", async (c) => {
  try {
    const stats = await getAllDeckStats();
    return c.json(stats);
  } catch (e) {
    console.error("Error in getAllDeckStats:", e);
    throw new HTTPException(500, { message: "Internal server error" });
  }
});
