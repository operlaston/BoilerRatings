const majorsRouter = require('express').Router()
const {to} = require('await-to-js')
const Major = require('../models/major')

majorsRouter.get('/', async (req, res) => {
  const [error, majors] = await to(Major.find({}).populate('requirements'))
  if (error) {
    console.error(error);
    return res.status(500).json({error: "server error"})
  }
  return res.status(200).json(majors)
})

majorsRouter.get('/:id', async (req, res) => {
  const [error, major] = await to(Major.findById(req.params.id).populate('requirements'))
  if (error) {
    console.error(error)
    return res.status(404).json({error: "id doesn't exist"})
  }
  res.status(200).json(major)
})

majorsRouter.post('/', async (req, res) => {
  const {name, requirements} = req.body;
  const major = new Major({
    name,
    requirements
  })
  try {
    const savedMajor = await major.save()
    res.status(201).json(savedMajor)
  }
  catch(e) {
    console.error(e)
    res.status(500).json({error: 'server error'})
  }
})

majorsRouter.delete('/:id', async (req, res) => {
  try {
    await Major.findByIdAndDelete(req.params.id)
    res.status(204).end()
  }
  catch(e) {
    res.status(500).json({error: 'server error'})
  }
})

module.exports = majorsRouter