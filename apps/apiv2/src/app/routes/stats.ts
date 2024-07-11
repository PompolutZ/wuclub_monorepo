import { Hono } from "hono";
import { getAllDeckStats } from "../../dal/stats";

export const app = new Hono().get("/decks", async (c) => {
  try {
    const stats = await getAllDeckStats();
    return c.json(stats);
  } catch (e) {
    return c.json({ status: 500, error: "Internal server error" });
  }
});
