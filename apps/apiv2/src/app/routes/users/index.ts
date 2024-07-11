import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authenticate } from "@/app/middlewares/authentication";
import { getUserByFuid, setUser } from "@/dal/users";
import { z } from "zod";
import { factionsSchema } from "@fxdxpz/schema";
import { getAllUserDecks } from "../../../dal/decks/getAllUserDecks";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

const updateUserSchema = z.object({
  displayName: z
    .string()
    .min(2)
    .max(50)
    .regex(/[a-zA-Z-0-9]+/),
  avatar: factionsSchema,
});

const deckQueryOptionsSchema = z.object({
  skip: z.coerce.number().optional().default(0),
  limit: z.coerce.number().max(30).optional().default(30),
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
        return c.json({ status: 403, error: "Unauthorized" });
      }

      return c.json(user);
    } catch (e) {
      console.error("Error in getUser:", e);
      return c.json({ status: 500, error: "Internal server error" });
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
      console.error("Error in postUser:", e);
      return c.json({ status: 500, error: "Internal server error" });
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
      console.error("Error in putUser:", e);
      return c.json({ status: 500, error: "Internal server error" });
    }
  })
  .get("/decks", zValidator("query", deckQueryOptionsSchema), async (c) => {
    try {
      const { uid: fuid } = c.get("claims");
      const query = c.req.valid("query");
      const decks = await getAllUserDecks({ ...query, fuid });
      return c.json(decks);
    } catch (e) {
      console.error("Error in getUserDecks:", e);
      return c.json({ status: 500, error: "Internal server error" });
    }
  });

export { app };
