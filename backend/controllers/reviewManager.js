const Review = require('../models/review')
const User = require('../models/user')

// client should send an object with two review fields, one for the old review and one for the new review
exports.editReview = async (req, res) => {
    const { oldReview, newReview } = req.body
    try {
        review = await Review.findOne(oldReview)
        if (review === null) {
            res.status(401).json({ "error": "review not found" })
            return
        }
        Review.findOneandReplace(review, newReview)
        res.status(200).json({ "message": "review successfully edited" })
        return
    }
    catch (err) {
        res.status(400).json({ "error": "bad request" })
        return
    }
}

// client should send a review object
exports.deleteReview = async (req, res) => {
    const review = req.body
    try {
        const r = await Review.findOne(review)
        if (r === null) {
            res.status(401).json({ "error": "review not found" })
            return
        }
        Review.findOneandDelete(r);
        res.status(200).json({ message: "review successfully deleted" })
        return
    }
    catch (err) {
        res.status(400).json({ "error": "bad request" })
        return
    }
}

const reviewLikeRouter = require('express').Router


// positive is a boolean which dictates like (true) or dislike (false)
reviewLikeRouter.post('/', async (req, res) => {
    const { review, user, positive } = req.body
    try {
        review = await Review.findById(review)
        if (!review) {
            return res.status(401).json({ "error": "review not found" })
        }
        user = await User.findById(user);
        if (user.likedReviews.includes(review)) {
            return res.status(401).json({"error": "user has already liked/disliked this review"})
        }

        const num = positive ? 1 : -1
        await Review.findByIdAndUpdate(review, { $inc: { likes: num } })
        await User.findByIdAndUpdate(user, { $push: { likedReviews: review._id } })

        return res.status(200).json({ "message": "review changed successfully" })
    }
    catch (err) {
        return res.status(401).json({"error": "bad request"})
    }
})

module.exports = reviewLikeRouter
