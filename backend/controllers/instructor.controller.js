const instructorRouter = require('express').Router()
const Instructor = require('../models/instructor')
const Course = require('../models/course')

instructorRouter.post('/', async (req, res) =>{
    const {name} = req.body;
    const instructor = new Instructor({
        name: name,
        gpa: 0,
        rmp: 0,
        rmpLink: "",
        course: []
    })
    try {
        const savedInstructor = await instructor.save()
        res.status(201).json(savedInstructor)
    } catch (error) {
        res.status(400).json({error: 'Invalid Instructor Data'})
    }
})

instructorRouter.put('/:id/courses', async (req, res) => {
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
//Puts the instrucor id in every courses course array
//Probably dont use this in general use but for sprint 2 we need instructors in our courses so putting test instructor 1 and test instructor 2 in
instructorRouter.put('/:id', async (req, res) => {
    try {
    const instructorId = req.params.id;
    console.log(instructorId)
    const instructor = await Instructor.findById(instructorId)
    console.log(instructor)
    if (!instructor) {
        return res.status(404).json({message: "Instructor not found"})
    }
    await Course.updateMany({},
        {$push: {instructors: instructorId}}
    )
    res.status(200).json({message: "Instructo added successfullty"})
} catch (error) {
    res.status(400).json({error: error.message})
}
})

module.exports = instructorRouter
