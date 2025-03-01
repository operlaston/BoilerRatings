const courseRouter = require('express').Router()
const { populate } = require('../models/review')
const Course = require('../models/user')

courseRouter.get('/:id', async (req, res) => {
    try {
        const course = await Course.findByID(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'instructor',
                select: 'instructorName gpa rmp'
            }
        })
        .populate('prerequisites', 'courseName courseNumber')
        if (!course) {
            return res.status(401).json({error: 'Course not found'})
        }
        res.status(200).json(course)
    } catch (err) {
        console.log('Course Fetch error', err)
        res.status(400).json({error: "bad request"})
    }
})

module.exports = courseRouter