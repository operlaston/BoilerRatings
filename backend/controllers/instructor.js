const instructorRouter = require('express').Router()
const Instructor = require('../models/instructor')
const Course = require('../models/course')

instructorRouter.post('/', async (req, res) =>{
    const instructor = new Instructor(req.body)
    try {
        const savedInstructor = await instructor.save()
        res.status(201).json(savedInstructor)
    } catch (error) {
        res.status(400).json({error: 'Invalid Instructor Data'})
    }
})

instructorRouter.put(':/id/courses', async (req, res) => {
    const {courseId} = req.body
    try {
        const course = await Course.findById(courseId)
        const instructor = await Instructor.findById(req.params.id)

        if (course && instructor) {
            course.instructors.push(instructor._id)
            await course.save()
            res.json(course)
        } else {
            res.status(404).json({ error: 'Instructor or Course not found'})
        }
    } catch (error) {
        res.status(400).json({error: 'Invalid Data'})
    }
})

module.exports = instructorRouter
