import express from "express";
import { VerifyToken } from "../utils/VerifyUser.js";
import { Create, getPosts, deletePost } from '../controllers/post.controller.js'


const router = express.Router();

router.post('/create-post', VerifyToken, Create);
router.get('/getposts', getPosts);
router.delete('/deletepost/:postId/:userId', VerifyToken, deletePost);

export default router;