const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Major = require('../models/major')

usersRouter.post('/', async (req, res) => {
  const { username, email, password, graduationSemester, major } = req.body
  try {
    // search db for major
    const majorId = (await Major.findOne({name: major})).id

    const duplicateUser = await User.findOne({username})
    if (duplicateUser !== null) {
      console.log("username exists already")
      res.status(409).json({"error": "username already exists"})
      return
    }

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
    res.status(201).end()
  }
  catch (err) {
    // catches major not existing (error) and bad requests
    console.log("an error occured while creating user")
    res.status(400).json({"error": "bad request"})
  }
})

usersRouter.get('/', async (req, res) => {
})

module.exports = usersRouter