const usersRouter = require('express').Router()
bcrypt = require('bcrypt')
const User = require('../models/user')
const Major = require('../models/major')

usersRouter.post('/', async (req, res) => {
  const { username, email, password, graduationSemester, major } = req.body
  // search db for major
  const majorId = (await Major.findOne({name: major})).id

  // store object in database (doesn't need to have all fields)
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = new User({
    username,
    email,
    passwordHash,
    graduationSemester,
    major: majorId,
    reviews: [],
    likedReviews: [],
    plans: []
  })
  const savedUser = await user.save()
  res.status(201).json(savedUser)
})

usersRouter.get('/', async (req, res) => {
})

module.exports = usersRouter