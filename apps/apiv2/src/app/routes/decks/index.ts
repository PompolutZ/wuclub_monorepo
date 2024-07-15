import {
  deleteDeckById as _deleteDeckById,
  getAllDecks as _getAllDecks,
  getDeckById as _getDeckById,
  createNewDeck,
  updateDeck,
} from "@/dal";
import { deckPayloadSchema } from "@fxdxpz/schema";
import { zValidator } from "@hono/zod-validator";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { authenticate } from "../../middlewares/authentication";
import { DeckIdSchema, getAllDecksSchema } from "./schemas";

export const app = new Hono<{
  Variables: {
    claims: DecodedIdToken;
  };
}>()
  .get("/", zValidator("query", getAllDecksSchema), async (c) => {
    try {
      const decks = await _getAllDecks(c.req.valid("query"));
      return c.json(decks);
    } catch (e) {
      console.error("Error in getAllDecks:", e);
      throw new HTTPException(500, { message: "Internal server error" });
    }
  })
  .get("/:id", authenticate, async (c) => {
    try {
      const deckId = DeckIdSchema.parse(c.req.param("id"));
      const deck = await _getDeckById(deckId);
      const claims = c.get("claims");
      if (deck.private && claims?.uid !== deck.fuid) {
        throw new HTTPException(403, { message: "Forbidden" });
      }

      if (!deck) {
        throw new HTTPException(404, { message: "Deck not found" });
      }

      return c.json(deck);
    } catch (e) {
      console.error("Error in getDeckById:", e);
      throw new HTTPException(500, { message: "Internal server error" });
    }
  })
  .post("/", authenticate, zValidator("json", deckPayloadSchema), async (c) => {
    try {
      const claims = c.get("claims");
      if (!claims) {
        throw new HTTPException(401, { message: "Unauthorized" });
      }

      const deck = await createNewDeck(c.req.valid("json"), claims.uid);
      return c.json({ status: 201, data: deck });
    } catch (e) {
      console.error("Error in createNewDeck:", e);
      throw new HTTPException(500, { message: "Internal server error" });
    }
  })
  .put(
    "/:id",
    authenticate,
    zValidator("json", deckPayloadSchema),
    async (c) => {
      const deckId = DeckIdSchema.parse(c.req.param("id"));
      const { uid } = c.get("claims");
      if (!uid) {
        throw new HTTPException(401, { message: "Unauthorized" });
      }

      const result = await updateDeck(deckId, uid, c.req.valid("json"));
      return c.json(result);
    },
  )
  .delete("/:id", authenticate, async (c) => {
    try {
      const deckId = DeckIdSchema.parse(c.req.param("id"));
      const claims = c.get("claims");
      if (!claims) {
        throw new HTTPException(401, { message: "Unauthorized" });
      }

      const result = await _deleteDeckById(deckId, claims.uid);
      return c.json({ deletedCount: result.deletedCount });
    } catch (e) {
      console.error("Error in deleteDeckById:", e);
      throw new HTTPException(500, { message: "Internal server error" });
    }
  });