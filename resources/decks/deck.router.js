import { Router } from "express";
import { getDeckById } from "./deck.controller.js";

const router = Router();

router.get('/:id', getDeckById);

export default router;