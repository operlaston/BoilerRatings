const Review = require('../models/review')
const User = require('../models/user')

// client should send a string [OLD_REVIEW_ID]||[NEW_REVIEW]
// NOTE: use JSON.stringify(review) to convert the new review to a string
exports.editReview = async (req, res) => {
    var data = req.body
    try {
        data = data.split("||")
        const oldReviewid = data[0]
        const newData = JSON.parse(data[1])
        if (newData === null) {
            res.status(400).json({ "error": "bad request" })
            return
        }
        const newReview = new Review(newData)
        review = await Review.findById(oldReviewid)
        if (review === null) {
            res.status(401).json({ "error": "review not found" })
            return
        }
        newReview._id = oldReviewid
        await Review.findByIdAndUpdate(oldReviewid, newReview, { new: true }) // changed
        res.status(200).json({ "message": "review successfully edited" })
        return
    }
    catch (err) {
        res.status(400).json({ "error": "bad request" })
        return
    }
}

// client should send a review_id
exports.deleteReview = async (req, res) => {
    const reviewID = req.body
    try {
        const r = await Review.findById(reviewID)
        if (r === null) {
            res.status(401).json({ "error": "review not found" })
            return
        }
        await Review.findOneAndDelete(r);
        res.status(200).json({ message: "review successfully deleted" })
        return
    }
    catch (err) {
        res.status(400).json({ "error": "bad request" })
        return
    }
}


// client should send a string [USER_ID]||[REVIEW_ID]
exports.likeReview = async (req, res) => {
    var data = req.body
    try {
        data = data.split("||")
        const userId = data[0]
        const reviewId = data[1]
        if (reviewId === null) {
            res.status(400).json({ "error": "bad request" })
            return
        }
        review = await Review.findById(reviewId)
        if (!review) {
            return res.status(401).json({ "error": "review not found" })
        }
        user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ "error": "user not found" })
        }
        // check if user has already interacted with this review
        const includesReview = user.likedReviews.find((likedReview) => likedReview.review._id.toString() == review._id)
        if (includesReview) {
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
            await User.findByIdAndUpdate(user, { $push: { likedReviews: { review: review, favorability: 1 } } })
            await Review.findByIdAndUpdate(review, { $inc: { likes: 1 } })
        }

        return res.status(200).json({ "message": "review changed successfully" })
    }
    catch (err) {
        return res.status(400).json({"error": "bad request"})
    }
}

// client should send a string [USER_ID]||[REVIEW_ID]
exports.dislikeReview = async (req, res) => {
    var data = req.body
    try {
        data = data.split("||")
        const userId = data[0]
        const reviewId = data[1]
        if (reviewId === null) {
            res.status(400).json({ "error": "bad request" })
            return
        }

        review = await Review.findById(reviewId)
        if (!review) {
            return res.status(401).json({ "error": "review not found" })
        }
        user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ "error": "user not found" })
        }
        // check if user has already interacted with this review
        const includesReview = user.likedReviews.find((likedReview) => likedReview.review._id.toString() == review._id)
        if (includesReview) {
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
            await User.findByIdAndUpdate(user, { $push: { likedReviews: { review: review, favorability: -1 } } })
            await Review.findByIdAndUpdate(review, { $inc: { likes: -1 } })
        }

        return res.status(200).json({ "message": "review changed successfully" })
    }
    catch (err) {
        return res.status(400).json({ "error": "bad request" })
    }
}

