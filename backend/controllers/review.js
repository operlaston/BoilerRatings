const reviewRouter = require('express').Router()
const User = require('../models/user')
const Review = require('../models/review')
const Course = require('../models/course')

reviewRouter.get('/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
        .populate('instrutor', 'instructorName gpa')
        .populate('user', 'username email')
        .populate('reports')
        if (!review) {
            return res.status(401).json({error : 'Review not found'})
        }
        res.status(200).json(review)
    } catch (err) {
        console.log('Review Fetch error', err)
        res.status(400).json({error: "Bad request"})
    }
}) 

reviewRouter.post('/', async (req, res) => {
    const {review, course} = req.body
    const user = review.user

    try {
        const courseExists = await Course.findById(course)
        if (!courseExists) {
            return res.status(401).json({error: 'Course not found'})
        }
        const newReview = new Review(review)
        const savedReview = await newReview.save()

        await Course.findByIdAndUpdate(course, {
            $push: {reviews: savedReview._id},
            $inc: { numReviews: 1},
            $set: {
                difficulty: (courseExists.difficulty * courseExists.numReviews + review.difficulty) / (courseExists.numReviews + 1),
                enjoyment: (courseExists.enjoyment * courseExists.numReviews + review.enjoyment) / (courseExists.numReviews + 1),
                recommended: review.recommended === true ? courseExists.recommended + 1: courseExists.recommended
            }
        })
        await User.findByIdAndUpdate(user, {$push: {reviews: savedReview._id}})

        res.status(201).json(savedReview)
    } catch (err) {
        console.error('Error adding review:', err)
        res.status(400).json({error: "Bad request"})
    }
})

reviewRouter.get('/course', async(req, res) => {
    const cID = req.body
    console.log(cID)
    try {
        const courseFound = await Course.findById(cID)
        .populate({
            path: 'reviews',
            populate: {
                path: 'user',
                select: 'username email'
            }
        })
        const reviews = courseFound.reviews
        res.status(200).json({reviews})
    } catch (error) {
        console.error('Error adding review', error)
        res.status(400).json({error: 'Bad Request'})
    }
})

// delete a review
// client should send a review_id
reviewRouter.delete('/:id', async (req, res) => {
    const reviewID = req.params.id
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
})

// like a review
// client should send an object {userId}
reviewRouter.put('/like/:id', async (req, res) => {
    const { userId } = req.body
    const reviewId = req.params.id
    try {
        if (reviewId === null) {
            res.status(400).json({ "error": "bad request" })
            return
        }
        const review = await Review.findById(reviewId)
        if (!review) {
            return res.status(401).json({ "error": "review not found" })
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ "error": "user not found" })
        }
        // check if user has already interacted with this review
        const includesReview = user.likedReviews.find((likedReview) => likedReview.review._id.toString() == review._id)
        if (includesReview) {
            if (includesReview.favorability == 1) {
                // user has already liked review
                // remove like from user list and decrement like count by one
                await User.findByIdAndUpdate(userId, { $pull: { likedReviews: { review: review._id } } })
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
})


reviewRouter.put('/dislike/:id', async (req, res) => {
    const { userId } = req.body
    const reviewId = req.params.id
    try {
        if (reviewId === null) {
            res.status(400).json({ "error": "bad request" })
            return
        }

        const review = await Review.findById(reviewId)
        if (!review) {
            return res.status(401).json({ "error": "review not found" })
        }
        const user = await User.findById(userId);
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
})




module.exports = reviewRouter