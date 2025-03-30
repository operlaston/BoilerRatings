const courseRouter = require('express').Router()
const { populate } = require('../models/review')
const Course = require('../models/course')

/*courseRouter.get('/:id', async (req, res) => { // Commenting this out it might break something 
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
})*/

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

courseRouter.get('/:courseNumber', async (req,res) => {
    let num = req.params.courseNumber
    num = num.toUpperCase();
    num = num.replace(/([A-Z]+)(\d+)/, '$1 $2');
    //Number is now in form like such that cs180 -> CS 180
    try {
        const course = await Course.findOne({number: num}).populate({
            path: 'reviews'
        })
        .populate('instructors', 'name')
        if (!course) {
            res.status(404).json({message: "Course Not Found"});
        }
        res.status(200).json(course)
    }
    catch( error ) {
        res.status(400).json({error: "Invalid Course Number"})
    }
})

module.exports = courseRouter