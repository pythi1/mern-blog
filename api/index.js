import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./routes/user.route.js";

dotenv.config();

mongoose
    .connect( process.env.MONGO )
    .then(() => { console.log("mongodb is connected") })
    .catch((err) => { console.log(err) })


const app = express();

app.use( "/api/user", router );





app.listen(5000, () => {
    console.log("server is running...");
});