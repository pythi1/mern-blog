import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    if( !username || !email || !password || username === "" || email === "" || password === ""){
        return res.status(400).json({message: "all field are required... "});
    }

    const hashedpassword = bcryptjs.hashSync(password, 10);
    
    const newuser = new User({
        username, 
        email, 
        password : hashedpassword,
    });

    try {
        await newuser.save();
        res.json("singup done successfully....");
    } 
    catch (error) {
        res.status(500).json({message: error.message})
    };

}
