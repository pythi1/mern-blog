import Post from "../models/post.model.js";
import { errorhandler } from "../utils/error.js";

export const Create = async (req, res, next) => {

    console.log(req.body);

    if (!req.user.isAdmin) {
        return next(errorhandler(403, 'you ar enot allowed to create a post'));
    }

    if (!req.body.title || !req.body.content) {
        return next(errorhandler(400, 'please provide all the fields.'));
    }

    const slug = req.body.title
        .split(' ')
        .join('-')
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, '');


    const newpost = new Post({
        ...req.body,
        slug,
        userId: req.user.id,
    })



    try {
        const savedPost = await newpost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error)
    }

};
