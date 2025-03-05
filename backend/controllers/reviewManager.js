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


// client should send an object with a user and review object
exports.likeReview = async (req, res) => {
    const { review, user} = req.body
    try {
        review = await Review.findById(review)
        if (!review) {
            return res.status(401).json({ "error": "review not found" })
        }
        user = await User.findById(user);
        if (!user) {
            return res.status(401).json({ "error": "user not found" })
        }
        const includesReview = user.likedReviews.find((likedReview) => JSON.stringify(likedReview.review) == JSON.stringify(review))
        if (includesReview) {
            const index = user.likedReviews.findIndex((likedReview) => JSON.stringify(likedReview.review) == JSON.stringify(review))
            if (includesReview.favorability == 1) {
                // user has already liked review
                // remove like from user list and decrement like count by one
                await User.findByIdAndUpdate(user, { likedReviews: includesReview }, { $pull: { likedReviews: { $in: "likedReviews.$" } } })
                await Review.findByIdAndUpdate(review, { $inc: { likes: -1 } })
            } else {
                // user has already disliked review
                // change dislike to like and increment like count by 2 (net -1 to +1 likes)
                await User.findByIdAndUpdate(user, { likedReviews: includesReview }, { $set: { "likedReviews.$.favorability": 1 } })
                await Review.findByIdAndUpdate(review, { $inc: { likes: 2 } })
            }
        }
        else {
            // user hasn't interacted with review
            const newReview = new likedReview({ review: review, favorability: 1 })
            await User.findByIdAndUpdate(user, { $push: { likedReviews: newReview } })
            await Review.findByIdAndUpdate(review, { $inc: { likes: 1 } })
        }

        return res.status(200).json({ "message": "review changed successfully" })
    }
    catch (err) {
        return res.status(401).json({"error": "bad request"})
    }
}

// client should send an object with a user and review object
exports.dislikeReview = async (req, res) => {
    const { review, user } = req.body
    try {
        review = await Review.findById(review)
        if (!review) {
            return res.status(401).json({ "error": "review not found" })
        }
        user = await User.findById(user);
        if (!user) {
            return res.status(401).json({ "error": "user not found" })
        }
        const includesReview = user.likedReviews.find((likedReview) => JSON.stringify(likedReview.review) == JSON.stringify(review))
        if (includesReview) {
            const index = user.likedReviews.findIndex((likedReview) => JSON.stringify(likedReview.review) == JSON.stringify(review))
            if (includesReview.favorability == 1) {
                // user has already liked review
                // change like to dislike and decrement like count by 2 (net -1 to +1 likes)
                await User.findByIdAndUpdate(user, { likedReviews: includesReview }, { $set: { "likedReviews.$.favorability": -1 } })
                await Review.findByIdAndUpdate(review, { $inc: { likes: -2 } })
            } else {
                // user has already disliked review
                // remove dislike from user list and increment like count by one
                await User.findByIdAndUpdate(user, { likedReviews: includesReview }, { $pull: { likedReviews: { $in: "likedReviews.$" } } })
                await Review.findByIdAndUpdate(review, { $inc: { likes: 1 } })
            }
        }
        else {
            // user hasn't interacted with review
            const newReview = new likedReview({ review: review, favorability: -1 })
            await User.findByIdAndUpdate(user, { $push: { likedReviews: newReview } })
            await Review.findByIdAndUpdate(review, { $inc: { likes: -1 } })
        }

        return res.status(200).json({ "message": "review changed successfully" })
    }
    catch (err) {
        return res.status(401).json({ "error": "bad request" })
    }
}

