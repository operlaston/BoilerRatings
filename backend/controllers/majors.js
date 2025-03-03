const majorsRouter = require('express').Router()
const Major = require('../models/major')

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