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
        res.status(200).json(updatedPlan)
    } catch (error) {
        console.lob('Failed to updated Degree Plan:', error)
        res.status(400).json({error: 'Bad Request'})
    }
})

module.exports = degreePlanRouter