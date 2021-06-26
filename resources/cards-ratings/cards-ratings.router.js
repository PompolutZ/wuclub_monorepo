import { Router } from "express";
import { verifyFirebaseToken } from "../../middleware/firebase/fbadmin.js";
import { getAllRatings, getRatingsForSingleFaction, updateRatingsForSingleFaction } from "./cards-ratings.controller.js";

const router = Router();

router.get('/', getAllRatings);
router.get('/:faction', getRatingsForSingleFaction);
router.put('/:faction', verifyFirebaseToken, updateRatingsForSingleFaction);

export default router;