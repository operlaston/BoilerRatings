const degreePlanRouter = require('express').Router()
const DegreePlan = require('../models/degreeplan')

degreePlanRouter.post('/', async (req, res) => {
    const data = req.body
    const degreePlan = data.degreePlan
    const user = data.user

    try {
        const newDegreePlan = new DegreePlan(degreePlan)
        const savedDegreePlan = await newDegreePlan.save()
        await User.findByIdAndUpdate(user, {
            $push: {plans: savedDegreePlan._id}
        }, {new: true})
        res.status(201).json(savedDegreePlan)
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