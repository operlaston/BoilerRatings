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
