import Post from "../models/post.model.js";
import { errorhandler } from "../utils/error.js";

export const Create = async (req, res, next) => {

    // console.log(req.body);

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


export const getPosts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;

        const posts = await Post.find(
            {
                ...(req.query.userId && { userId: req.query.userId }),
                ...(req.query.category && { category: req.query.category }),
                ...(req.query.slug && { slug: req.query.slug }),
                ...(req.query.postId && { _id: req.query.postId }),

                ...(req.query.searchTerm && {
                    $or: [
                        { title: { $regex: req.query.searchTerm, $options: 'i' } },
                        { content: { $regex: req.query.searchTerm, $options: 'i' } },
                    ],
                }),
            }).sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit);

        const totalPosts = await Post.countDocuments();

        const now = new Date();

        // const oneMonthAgo = new Date(
        //     now.getFullYear(),
        //     now.getMonth() - 1,
        //     now.getTime(),
        // );

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts,
        });

    } catch (error) {
        next(error);
        console.log(error);
    }
};

export const deletePost = async (req, res, next) => {

    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorhandler(403, 'you are not allowed to delete this post'));
    }

    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json('this post has been deleted.');
    } catch (error) {
        next(error);
    }

};

export const updatePost = async (req, res, next) => {


    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        
        // console.log("user.id con:", req.user.id);
        // console.log("userId con ", req.params.userId);
        return next(errorhandler(403, 'you are not allowed to update this post.'))
    }

    try {

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            {
                $set: {
                    title: req.body.title,
                    content: req.body.content,
                    category: req.body.category,
                    image: req.body.image,
                }
            }, { new: true }
        )
        res.status(200).json(updatedPost);

    } catch (error) {
        next(error);

    }

}