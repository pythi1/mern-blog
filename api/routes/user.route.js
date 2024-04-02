import express from "express";
import {Updateuser, deleteUser, signOut, getUsers, test, getuser } from "../controllers/user.controller.js";
import { VerifyToken } from "../utils/VerifyUser.js";

const router = express.Router();

router.get("/test", test);

router.put('/update/:userId', VerifyToken, Updateuser );

router.delete('/delete/:userId', VerifyToken, deleteUser);

router.post('/signout', signOut);

router.get('/getusers', VerifyToken, getUsers);

router.get('/:userId', getuser);

export default router;