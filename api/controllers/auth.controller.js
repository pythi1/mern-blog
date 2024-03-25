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



        const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin}, process.env.JWT_SECRET);

        const { password: pass , ...rest} = validUser._doc;

        res.status(200).cookie("access_token", token, {
            httpOnly: true
        }).json(rest);

    } catch (error) {
        // console.log(error);
        next(error)
    }
}

export const google = async(req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;

    try {
        const user = await User.findOne({email});
        if(user){
            const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT_SECRET);
            const { password, ...rest } = user._doc;
            res.status(200).cookie("access_token", token, {
                httpOnly: true,
            }).json(rest);
        }
        else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            // const hashedpassword = bcryptjs.hashSync(generatedPassword, 10);
            const newuser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: generatedPassword,
                profilePicture: googlePhotoUrl,
            });
            await newuser.save();
            const token = jwt.sign({id: user._id, isAdmin: newuser.isAdmin}, process.env.JWT_SECRET);
            const { password, ...rest } = user._doc;
            res.status(200).cookie("access_token", token, {
                httpOnly: true,
            }).json(rest);
        }
    } catch (error) {
        console.log(error);
    }
}