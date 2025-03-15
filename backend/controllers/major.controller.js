const majorsRouter = require('express').Router()
const {to} = require('await-to-js')
const Major = require('../models/major')

majorsRouter.get('/', async (req, res) => {
  const [error, majors] = await to(Major.find({}))
  if (error) {
    console.error(error);
    return res.status(500).json({error: "server error"})
  }
  return res.status(200).json(majors)
  // try {
  //   const majors = await Major.find({})
  //   res.status(200).json(majors)
  // }
  // catch (err) {
  //   res.status(400).json({error: "bad request"})
  // }
})

majorsRouter.get('/:id', async (req, res) => {
  const [error, major] = await to(Major.findById(req.params.id))
  if (error) {
    console.error(error)
    return res.status(404).json({error: "id doesn't exist"})
  }
  res.status(200).json(major)
  // try {
  //   const major = await Major.findById(req.params.id)
  //   res.status(200).json(major)
  // }
  // catch (err) {
  //   res.status(404).json({error: "id doesn't exist"})
  // }
})

majorsRouter.post('/', async (req, res) => {
  const { name, requirements } = req.body
  const major = new Major({
    name,
    requirements
  })
  const savedMajor = await major.save()
  res.status(201).json(savedMajor)
})

module.exports = majorsRouter