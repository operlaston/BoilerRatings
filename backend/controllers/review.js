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
    course = req.body
    try {
        const courseFound = await Course.findById(course)
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

module.exports = reviewRouter