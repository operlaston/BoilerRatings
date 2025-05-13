const Course = require('../models/course')
const DegreePlan = require('../models/degreeplan')
const Instructor = require('../models/instructor')
const Major = require('../models/major')
const Report = require('../models/report')
const Requirement = require('../models/requirement')
const Review = require('../models/review')
const User = require('../models/user')

const calamityRouter = require('express').Router()

calamityRouter.delete('/', async(req, res) => {
  try {
    await Course.deleteMany({})
    await DegreePlan.deleteMany({})
    await Instructor.deleteMany({})
    await Major.deleteMany({})
    await Report.deleteMany({})
    await Requirement.deleteMany({})
    await Review.deleteMany({})
    await User.deleteMany({})
    res.status(204).end()
  }
  catch (e) {
    res.status(500).json({'error': 'failed to launch intercontinental ballistic missle'})
  }
})

module.exports = calamityRouter