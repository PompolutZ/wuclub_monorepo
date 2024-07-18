import { auth } from "@/services/firebase";
import { createMiddleware } from "hono/factory";

export const authenticate = createMiddleware(async (c, next) => {
  const token = c.req.header("authtoken");
  if (token) {
    const decoded = await auth.verifyIdToken(token);
    if (!decoded) {
      return c.json({ status: 401, error: "Unauthorized" });
    }

    c.set("claims", decoded);
  }

  await next();
});
