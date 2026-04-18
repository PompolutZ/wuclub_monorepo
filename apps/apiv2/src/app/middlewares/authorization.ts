import { getUserByFuid } from "@/dal/users";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import type { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

export const requireRole = (role: string) =>
  createMiddleware<{
    Variables: { claims: DecodedIdToken };
  }>(async (c, next) => {
    const claims = c.get("claims");
    if (!claims) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    const user = await getUserByFuid(claims.uid);
    if (!user?.role?.includes(role)) {
      throw new HTTPException(403, { message: "Forbidden" });
    }

    await next();
  });
