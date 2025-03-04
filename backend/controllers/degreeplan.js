const degreePlanRouter = require('express').Router()
const DegreePlan = require('../models/degreeplan')

degreePlanRouter.post('/', async (req, res) => {
    const degreePlan = req.body

    try {
        const newDegreePlan = new DegreePlan(degreePlan)
        const savedDegreePlan = await newDegreePlan.save()
        res.status(201).json(savedDegreePlan)
    } catch (error) {
        console.log("Failed to saved degree plan", error)
        res.status(400).json({error: 'Bad Request'})
    }
})

degreePlanRouter.put('/:id', async (req, res) => {
    const {original, updated } = req.body
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
/* This is for updating the action is add to add a semester and courses, remove to remove and semester and courses, update to replace courses in a specific semester */
degreePlanRouter.put('/:id/savedcourses', async (req, res) => {
    const { semester, courses, action } = req.body
    const planId = req.params.id

    try {
        const plan = await DegreePlan.findById(planId)
        if (!plan) {
            return res.status(404).json({error: "Degree Plan not found"})
        }
        let updatedPlan
        if (action === "add") {
            updatedPlan = await DegreePlan.findByIdAndUpdate(
                planId,
                {
                    $push: {
                        savedCourses: {semester, courses}
                    }
                },
                {new: true, runValidators: true}
            )
        } else if (action === "remove") {
            updatedPlan = await DegreePlan.findByIdAndUpdate(
                planId,
                {
                    $pull: {
                        savedCourses: {semester}
                    }
                },
                {new: true}
            )
        } else if (action === "update") {
            updatedPlan = await DegreePlan.findByIdAndUpdate(
                {_id: planId, "savedCourses.semester": semester},
                {
                    $set: {"savedCourses.$.courses": courses}
                },
                {new : true, runValidators: true}
            )
        } else {
            return res.status(400).json({error: "Invalid action"})
        }

        res.status(200).json(updatePlan)
    } catch (error) {
        console.log("Failed to update saved courses:", error)
        res.status(400).json({error: "Bad request"})
    }
})
module.exports = degreePlanRouter