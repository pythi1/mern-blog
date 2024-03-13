import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorhandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password || username === "" || email === "" || password === "") {
        next(errorhandler(400, "all fields are required signup."));
    }

    // const hashedpassword = bcryptjs.hashSync(password, 10);

    // const newuser = new User({
    //     username,
    //     email,
    //     password: hashedpassword,
    // });

    const newuser = new User({
        username,
        email,
        password
    });

    try {
        await newuser.save();
        res.json("singup done successfully....");
    }
    catch (error) {
        // res.status(500).json({message: error.message})
        next(error);
    };

}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email === " " || password === " ") {
       next(errorhandler(400, "All fields are  required signin."));
    }

    try {
        // console.log("email :", email)

        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorhandler(404, "User Not found !!!"));
        }

        console.log('Entered Password:', password);
        console.log('Stored Password:', validUser.password);


        // ..........................check for encrypted password.................

        // const validPassword = await bcryptjs.compare(password, validUser.password );

        // if(!validPassword){
        //   next(errorhandler(400, "invalid password"));
        // }



        // ********************** NON ENCRYPTED PASSWORD ********************

        if(password !== validUser.password){
            return next(errorhandler(400, "invalid password"));
        }



        const token = jwt.sign({ id: validUser._id, }, process.env.JWT_SECRET);

        // const { password : pass, ...rest} = validUser._docs;

        res.status(200).cookie("access_token", token, {
            httpOnly: true
        }).json(validUser);

    } catch (error) {
        // console.log(error);
        next(error)
    }
}