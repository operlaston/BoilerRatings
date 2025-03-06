const degreePlanRouter = require('express').Router()
const DegreePlan = require('../models/degreeplan')
const User = require('../models/user')

degreePlanRouter.post('/', async (req, res) => {
    const {user, planName, savedCourses} = req.body
    const newPlan = new DegreePlan({
        userID: user.id,
        planName: planName,
        savedCourses: savedCourses
    })
    newPlan.savedCourses = savedCourses.map((semester) => ({
        semester: semester.semester,
        semesterIndex: semester.semesterIndex,
        courses: semester.courses._id
    }));
    console.log(newPlan)
    try {
        const plan = await DegreePlan.findOne({
            userID: user._id,
            planName: planName
        })
        if (!plan) {
            //Need to create a new one
            const savedPlan = await newPlan.save()
            if(savedPlan) {
                console.log("Saved")
            } else {
                console.log("Didn't save")
            }
            await User.findByIdAndUpdate(user.id, {
                $push: {plans: savedPlan.id}
            }, {new: true})
        } else {
            //Need to save one
            const savedPlan = await DegreePlan.findByIdAndUpdate(plan._id, {
                $set: {savedCourses: newPlan.savedCourses}
            })
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

degreePlanRouter.get('/', async (req, res) => {
    const user = req.body

    try {
        const plans = await DegreePlan.find({
            userID: user._id
        })
        res.status(200).json(plans)
    } catch (error) {
        console.log("Couldn't find plans", error)
        res.status(400).json({error: 'Bad Request'})
    }
})

module.exports = degreePlanRouter