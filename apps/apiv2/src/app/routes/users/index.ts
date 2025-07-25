import { authenticate } from "@/app/middlewares/authentication";
import { getUserByFuid, setUser } from "@/dal/users";
import { factionsSchema } from "@fxdxpz/schema";
import { zValidator } from "@hono/zod-validator";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { getAllDecks } from "../../../dal";
import { getAllDecksSchema } from "../decks/schemas";

const updateUserSchema = z.object({
  displayName: z
    .string()
    .min(2)
    .max(50)
    .regex(/[a-zA-Z-0-9]+/),
  avatar: factionsSchema,
});

const app = new Hono<{
  Variables: {
    claims: DecodedIdToken;
  };
}>()
  .use(authenticate)
  .get("/", async (c) => {
    try {
      const { uid } = c.get("claims");
      const user = await getUserByFuid(uid);
      if (uid !== user?.fuid) {
        throw new HTTPException(403, { message: "Unauthorized" });
      }

      return c.json(user);
    } catch (e) {
      console.error("Error in getUser:", e);
      throw new HTTPException(500, { message: "Internal server error" });
    }
  })
  .post("/", zValidator("json", updateUserSchema), async (c) => {
    try {
      const payload = c.req.valid("json");
      const { uid } = c.get("claims");
      const user = {
        ...payload,
        fuid: uid,
        role: ["User"],
      };

      await setUser(user);
      return c.json(user);
    } catch (e) {
      console.error("Error in getUser:", e);
      throw new HTTPException(500, { message: "Internal server error" });
    }
  })
  .put("/", zValidator("json", updateUserSchema), async (c) => {
    try {
      const payload = c.req.valid("json");
      const { uid } = c.get("claims");
      const user = {
        ...payload,
        fuid: uid,
      };

      await setUser(user);
      return c.json(user);
    } catch (e) {
      console.error("Error in getUser:", e);
      throw new HTTPException(500, { message: "Internal server error" });
    }
  })
  .get("/decks", zValidator("query", getAllDecksSchema), async (c) => {
    try {
      const { uid: fuid } = c.get("claims");
      const decks = await getAllDecks({ ...c.req.valid("query"), fuid });
      return c.json(decks);
    } catch (e) {
      console.error("Error in getUser:", e);
      throw new HTTPException(500, { message: "Internal server error" });
    }
  });

export { app };
