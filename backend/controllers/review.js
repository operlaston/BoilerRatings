const reviewRouter = require('express').Router()
const Review = require('../models/user')

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

module.exports = reviewRouter