import express from "express";
import { test } from "../controllers/user.controller.js";
import { VerifyToken } from "../utils/VerifyUser.js";
import { Updateuser } from "../controllers/user.controller.js";
import { deleteUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/test", test);

router.put('/update/:userId', VerifyToken, Updateuser );

router.delete('/delete/:userId', VerifyToken, deleteUser);

export default router;