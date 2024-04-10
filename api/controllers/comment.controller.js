import { errorhandler } from "../utils/error.js";
import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {

    try {

        const { content, postId, userId } = req.body;

        if (userId !== req.user.id) {
            return next(errorhandler(403, 'unauthorised'));
        }

        const newComment = new Comment({
            content,
            postId,
            userId,
        });

        await newComment.save();
        res.status(200).json(newComment);

    } catch (error) {
        next(error);
        console.log("error is : ", error);
    }
};

export const getPostComment = async (req, res, next) => {

    try {

        const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: - 1, });

        res.status(200).json(comments);

    } catch (error) {
        next(error);
    }

};

export const likeComment = async (req, res, next) => {

    try {

        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return next(errorhandler(404, 'comment not found'));
        }

        const userIndex = comment.likes.indexOf(req.user.id);

        if (userIndex === -1) {

            comment.numberOfLikes += 1;
            comment.likes.push(req.user.id);


        } else {
            comment.numberOfLikes -= 1
            comment.likes.splice(userIndex, 1);

        }

        await comment.save();
        res.status(200).json(comment);

    } catch (error) {
        next(error);
    }

};

export const editComment = async (req, res, next) => {

    try {

        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return next(errorhandler(404, 'Commment not found.'));
        }

        if (comment.userId === req.user.id && !req.user.isAdmin) {
            return next(errorhandler(403, 'you are not allowed to edit this comment.'));
        }

        const editedComment = await Comment.findByIdAndUpdate(req.params.commentId, {
            content: req.body.content,
        }, { new: true });

        res.status(200).json(editedComment);

    } catch (error) {
        next(error);
    }
};

export const deleteComment = async (req, res, next) => {

    try {

        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return next(errorhandler(404, 'comment not found'));
        }

        if (comment.userId !== req.user.id && req.user.isAdmin) {
            return next(errorhandler(403, 'you are not allowed to delete this comment.'))
        }

        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json('comment has been deleted.');

    } catch (error) {
        next(error)
    }

};

export const getAllComments = async (req, res, next) => {

    if (!req.user.isAdmin) {
        return next(errorhandler(403, 'you are not allowed to see all the post.'));

    }

    try {

        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'desc' ? -1 : 1;
        const comments = await Comment.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

            const totalComments = await Comment.countDocuments();
            const now = new Date();
            const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            const lastmonthComments = await Comment.countDocuments({createdAt: {$gte: oneMonthAgo }});

            res.status(200).json({ comments, totalComments, lastmonthComments})
    } catch (error) {
        next(error);
    }

}