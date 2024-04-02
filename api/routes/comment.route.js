import express from "express";
import { createComment, getPostComment } from "../controllers/comment.controller.js";
import { VerifyToken } from "../utils/VerifyUser.js";

const router = express.Router();

router.post('/create', VerifyToken, createComment);

router.get('/getpostcomment/:postId', getPostComment);

export default router;