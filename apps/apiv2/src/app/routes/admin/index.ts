import { authenticate } from "@/app/middlewares/authentication";
import { requireRole } from "@/app/middlewares/authorization";
import { getDecksValidityStats, recomputeDecksValidity } from "@/dal";
import { ADMIN_ROLE } from "@fxdxpz/schema";
import type { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

export const app = new Hono<{
  Variables: { claims: DecodedIdToken };
}>()
  .use(authenticate)
  .use(requireRole(ADMIN_ROLE))
  .post("/jobs/recompute-deck-validity", async (c) => {
    try {
      const result = await recomputeDecksValidity();
      return c.json(result);
    } catch (e) {
      console.error("Error in recomputeDecksValidity:", e);
      throw new HTTPException(500, { message: "Internal server error" });
    }
  })
  .get("/stats/deck-validity", async (c) => {
    try {
      const result = await getDecksValidityStats();
      return c.json(result);
    } catch (e) {
      console.error("Error in getDecksValidityStats:", e);
      throw new HTTPException(500, { message: "Internal server error" });
    }
  });
