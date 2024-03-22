import User from "../models/user.model.js";
import { errorhandler } from "../utils/error.js";

export const test = (req, res) => {
    res.json({message: " api is running"});
};


export const Updateuser = async (req, res, next) => {
    console.log(req.user);

    if(req.user.id !== req.params.userId){
        return next(errorhandler(403, "you are not allowed to update this user."));
    }

    if(req.body.password){
        if(req.body.password.length < 6 ){
            return next(errorhandler(400, "length of the passwprd must be more than 6 char."));

        }

        // req.body.password = bcryptjs.hashSync(req.body.password , 10 );

    }

    if(req.body.username){
        if(req.body.username.length < 7 || req.body.username.length > 20){
            return next(errorhandler(400, "username must be between 7 to 20 char"));
        }

        if(req.body.username.includes(' ')){
            return next(errorhandler(400, "username can't have space"));
        }
        
        if(req.body.username !== req.body.username.toLowerCase()){
            return next(errorhandler(400, "username must be in lowercase. "))
        }

        if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){
            return next(errorhandler(400, 'username can only be contains letter and numbers.'))
        }

        try {
            const Updateduser = await User.findByIdAndUpdate(req.params.userId, {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    profilePicture: req.body.profilePicture,
                    password: req.body.password,
                    
                }, 
            }, {new: true});
            const {password, ...rest } = Updateduser._doc;
            res.status(200).json(rest);
        } catch (error) {
            next(error);
        }
    }
}