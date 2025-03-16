const courseRouter = require('express').Router()
const { populate } = require('../models/review')
const Course = require('../models/course')

// get courses that match requirement
courseRouter.get('/requirement', async (req, res) => {
    const { requirement } = req.body
    try {
        if (requirement == null) {
            return res.status(401).json({ "error": "null requirement string" })
        }

        const courses = await Course.find({ requirements: requirement })
        if (courses.length == 0) {
            return res.status(404).json({ "error": "no courses found" })
        }

        return res.status(200).json(courses)
    }
    catch (err) {
        return res.status(400).json({ "error": "bad request" })
    }
})

courseRouter.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        .populate({
            path: 'reviews'
        })
        .populate('prerequisites', 'name number')
        .populate('instructors', 'name')
        if (course) {
            return res.status(401).json({error: 'Course not found'})
        } 
        res.status(200).json(course)
    } catch (err) {
        console.log('Course Fetch error', err)
        res.status(400).json({error: "1 bad request"})
    }
})

courseRouter.get('/', async (req, res) => {
    try {
        const courses = await Course.find()
        .populate({
            path: 'reviews'
        })
        .populate('instructors', 'name')
        // console.log("Courses found", courses)
        res.status(200).json(courses)
    } catch (error) {
        console.log("Error fetching courses", error)
        res.status(400).json({error: "2 bad request"})
    }
})

courseRouter.post('/', async (req,res) => {
    const course = new Course(req.body)

    try {
        const savedCourse = await course.save()
        res.status(201).json(savedCourse)
    } catch (error) {
        console.log(error)
        res.status(400).json({error: 'Invalid Course Data'})
    }
})

module.exports = courseRouter