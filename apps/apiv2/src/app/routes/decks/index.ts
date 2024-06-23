import {
  getAllDecks as _getAllDecks,
  getDeckById as _getDeckById,
  deleteDeckById as _deleteDeckById,
  createNewDeck,
  updateDeck,
} from "@/dal";
import { zValidator } from "@hono/zod-validator";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { Hono } from "hono";
import {
  DeckIdSchema,
  getAllDecksSchema,
  newDeckSchema,
  updateDeckSchema,
} from "./schemas";
import { authenticate } from "../../middlewares/authentication";

export const app = new Hono<{
  Variables: {
    claims: DecodedIdToken;
  };
}>()
  .get("/", zValidator("query", getAllDecksSchema), async (c) => {
    try {
      const decks = await _getAllDecks(c.req.valid("query"));
      return c.json({ data: decks });
    } catch (e) {
      return c.json({ status: 500, error: "Internal server error" });
    }
  })
  .get("/:id", authenticate, async (c) => {
    try {
      const deckId = DeckIdSchema.parse(c.req.param("id"));
      const deck = await _getDeckById(deckId);
      const claims = c.get("claims");
      if (deck.private && claims?.uid !== deck.fuid) {
        return c.json({ status: 403, error: "Forbidden" });
      }

      if (!deck) {
        return c.json({ status: 404, error: "Deck not found" });
      }

      return c.json({ data: deck });
    } catch (e) {
      return c.json({ status: 500, error: "Internal server error" });
    }
  })
  .post("/", authenticate, zValidator("json", newDeckSchema), async (c) => {
    try {
      const claims = c.get("claims");
      if (!claims) {
        return c.json({ status: 401, error: "Unauthorized" });
      }

      const deck = await createNewDeck(c.req.valid("json"), claims.uid);
      console.log(deck);
      return c.json({ status: 201, data: deck });
    } catch (e) {
      return c.json({ status: 500, error: "Internal server error" });
    }
  })
  .put(
    "/:id",
    authenticate,
    zValidator("json", updateDeckSchema),
    async (c) => {
      const deckId = DeckIdSchema.parse(c.req.param("id"));
      const { uid } = c.get("claims");
      if (!uid) {
        return c.json({ status: 401, error: "Unauthorized" });
      }

      const result = await updateDeck(deckId, uid, c.req.valid("json"));
      return c.json({ data: result });
    },
  )
  .delete("/:id", authenticate, async (c) => {
    try {
      const deckId = DeckIdSchema.parse(c.req.param("id"));
      const claims = c.get("claims");
      if (!claims) {
        return c.json({ status: 401, error: "Unauthorized" });
      }

      const result = await _deleteDeckById(deckId, claims.uid);
      return c.json({ data: { deletedCount: result.deletedCount } });
    } catch (e) {
      return c.json({ status: 500, error: "Internal server error" });
    }
  });

export type DeckRoutes = typeof app;