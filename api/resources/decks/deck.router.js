import { Router } from "express";
import { verifyFirebaseToken } from "../../middleware/firebase/fbadmin.js";
import { getPrivateDeckById, getPublicDeckById } from "./deck.controller.js";

const router = Router();

router.get('/public/:id', getPublicDeckById);
router.get('/private/:id', verifyFirebaseToken, getPrivateDeckById);

export default router;