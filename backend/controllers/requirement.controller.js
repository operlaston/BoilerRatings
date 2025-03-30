const requirementRouter = require('express').Router()
const Requirement = require('../models/requirement')

requirementRouter.get('/', async (req, res) => {
  try {
    const requirements = await Requirement.find({})
    console.log("requirements: " + requirements);
    res.status(200).json(requirements)
  }
  catch(e) {
    console.error(e)
    res.status(500).json({error: 'server error'})
  }
})

requirementRouter.get('/:id', async (req, res) => {
  try {
    const requirement = await Requirement.findById(req.params.id)
    res.status(200).json(requirement)
  }
  catch(e) {
    console.error(e)
    res.status(500).json({error: 'server error'})
  }
})

requirementRouter.post('/', async (req, res) => {
  try {
    const requirement = new Requirement(req.body)
    const returnedReq = await requirement.save()
    res.status(201).json(returnedReq)
  }
  catch (e) {
    console.error(e)
    res.status(500).json({error: 'server error'})
  }
})

// get courses that match requirement
requirementRouter.put('/courses', async (req, res) => {
  const { requirement } = req.body
  try {
      if (requirement == null) {
          return res.status(401).json({ "error": "null requirement string" })
      }
      
      const requireObj = await Requirement.findOne({name: requirement});
      if (requireObj == null) {
        return res.status(404).json({ "error": "requirement not found!" })
      }

      var courses = []
      requireObj.subrequirements.forEach((require) => {
        console.log(require)
        courses = courses.concat(require.courses)
      });
      console.log("Courses: " + courses)
      return res.status(200).json(courses)
  }
  catch (err) {
      console.log(err);
      return res.status(400).json({ "error": "bad request" })
  }
})

// update an object
requirementRouter.put('/:id', async (req, res) => {
  const editedRequirement = req.body
  try {
    const newRequirement = await Requirement.findByIdAndUpdate(req.params.id, editedRequirement, {new: true})
    res.status(200).json(newRequirement)
  }
  catch(e) {
    console.error(e)
    res.status(500).json({error: 'server error'})
  }
})

requirementRouter.delete('/deleteall', async (req, res) => {
  try {
    await Requirement.deleteMany({})
    res.status(204).end()
  }
  catch(e) {
    res.status(500).json({'error': 'server error'})
  }
})

module.exports = requirementRouter