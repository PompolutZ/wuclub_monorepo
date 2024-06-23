import {
  getAllDecks as _getAllDecks,
  getDeckById as _getDeckById,
  deleteDeckById as _deleteDeckById,
} from "@/dal";
import { zValidator } from "@hono/zod-validator";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { Hono } from "hono";
import { DeckIdSchema, getAllDecksSchema } from "./schemas";
import { authenticate } from "../../middlewares/authentication";

export const app = new Hono<{
  Variables: {
    claims: DecodedIdToken;
  };
}>();
app
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

// export const updateDeck = async (req: Request, res: Response) => {
//   res.status(501);
// };

// export const deleteDeck = async (req: Request, res: Response) => {
//   res.status(501);
// };

// export const getAllUsersDecks = async (req: Request, res: Response) => {
//   res.status(501).json({ error: "Not implemented" });
// };

// export const createDeck = async (req: Request, res: Response) => {
//   res.status(501);
// };
