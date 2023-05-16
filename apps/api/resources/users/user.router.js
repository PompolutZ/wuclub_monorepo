import { Router } from "express";
import { verifyFirebaseToken } from "../../middleware/firebase/fbadmin.js";
import { createUser, getUser, updateUser } from "./user.controller.js";

const router = Router();

router.get('/', verifyFirebaseToken, getUser);
router.post('/', verifyFirebaseToken, createUser);
router.put('/', verifyFirebaseToken, updateUser);
export default router;