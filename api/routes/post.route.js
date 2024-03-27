import express from "express";
import { VerifyToken } from "../utils/VerifyUser.js";
import { Create } from '../controllers/post.controller.js'
import { getPosts } from "../controllers/post.controller.js";

const router = express.Router();

router.post('/create-post', VerifyToken, Create);
router.get('/getposts', getPosts);

export default router;