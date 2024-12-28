import express from "express";
import { VerifyToken } from "../utils/VerifyUser.js";
import { Create, getPosts, deletePost, updatePost } from '../controllers/post.controller.js'


const router = express.Router();


router.post('/create-post', VerifyToken, Create);

router.get('/getposts', getPosts);

router.delete('/deletepost/:postId/:userId', VerifyToken, deletePost);

router.put('/updatepost/:postId/:userId', VerifyToken, updatePost);

export default router;


// 676e9b4d013b7b84bb2ae002   676e9b4d013b7b84bb2ae002   
// 676e94d974ba259ea747e806