const degreePlanRouter = require('express').Router()
const Course = require('../models/course')
const DegreePlan = require('../models/degreeplan')
const User = require('../models/user')

degreePlanRouter.post('/', async (req, res) => {
    const {user, planName, savedCourses} = req.body
    const newPlan = new DegreePlan({
        userID: user.id,
        planName: planName,
    })
    let newSavedCourses = savedCourses.map(savedCourses => {
        return {
            semester: savedCourses.semester,
            semesterIndex: savedCourses.semesterIndex,
            courses: Array.isArray(savedCourses.courses) && savedCourses.courses.length > 0
                ? savedCourses.courses.map(course => course.id) 
                : [] 
        }
    })
    newPlan.savedCourses = newSavedCourses
    
    try {
        const plan = await DegreePlan.findOne({
            userID: user.id,
            planName: planName
        })
        if (!plan) {
            //Need to create a new one
            const savedPlan = await newPlan.save()
            await User.findByIdAndUpdate(user.id, {
                $push: {plans: savedPlan.id}
            }, {new: true})
        } else {
            //Need to save one
            const savedPlan = await DegreePlan.findOneAndUpdate({
                userID: user.id,
                planName: planName
            }, 
                {savedCourses: newSavedCourses}
            )
            if (!savedPlan) {
                console.log("Error went into saved but didn't work")
            }
        }
        res.status(201).json()
    } catch (error) {
        console.log("Failed to saved degree plan", error)
        res.status(400).json({error: 'Bad Request'})
    }
})

degreePlanRouter.put('/:id', async (req, res) => {
    const updated = req.body
    const id = req.params.id

    try {
        const existingPlan = await DegreePlan.findById(id)
        if (!existingPlan) {
            return res.status(401).json({error: 'No degree plan'})
        }
        const updatePlan = await DegreePlan.findByIdAndUpdate(id, updated, {new: true, runValidators: true})
        res.status(200).json(updatePlan)
    } catch (error) {
        console.log('Failed to updated Degree Plan:', error)
        res.status(400).json({error: 'Bad Request'})
    }
})

degreePlanRouter.get('/:id', async (req, res) => {
    const userID = req.params.id

    try {
        const plans = await DegreePlan.find({
            userID: userID
        })
        res.status(200).json(plans)
    } catch (error) {
        console.log("Couldn't find plans", error)
        res.status(400).json({error: 'Bad Request'})
    }
})

module.exports = degreePlanRouter