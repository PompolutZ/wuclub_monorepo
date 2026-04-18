import { authenticate } from "@/app/middlewares/authentication";
import { requireRole } from "@/app/middlewares/authorization";
import { ADMIN_ROLE } from "@fxdxpz/schema";
import type { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { Hono } from "hono";

export const app = new Hono<{
  Variables: { claims: DecodedIdToken };
}>()
  .use(authenticate)
  .use(requireRole(ADMIN_ROLE))
  .post("/jobs/recompute-deck-validity", async (c) => {
    // Actual implementation lands in a follow-up: iterate all decks,
    // compute isValid with @fxdxpz/wudb, persist on each document.
    return c.json({ status: "not_implemented" as const });
  });
