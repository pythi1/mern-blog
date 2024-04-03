import express from "express";
import { createComment, editComment, getPostComment, likeComment } from "../controllers/comment.controller.js";
import { VerifyToken } from "../utils/VerifyUser.js";

const router = express.Router();

router.post('/create', VerifyToken, createComment);

router.get('/getpostcomment/:postId', getPostComment);

router.put('/likecomment/:commentId', VerifyToken, likeComment );

router.put('/editcomment/:commentId', VerifyToken, editComment);

export default router;