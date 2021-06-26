import { Router } from "express";
import { getAllRatings, getRatingsForSingleFaction } from "./cards-ratings.controller.js";

const router = Router();

router.get('/', getAllRatings);
router.get('/:faction', getRatingsForSingleFaction);

export default router;