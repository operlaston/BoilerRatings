const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Major = require('../models/major')
const sendEmail = require('../utils/email')

usersRouter.post('/', async (req, res) => {
  //const { username, email, password, graduationSemester, major } = req.body
  const {email, password} = req.body
  try {
    // search db for major

    //const majorId = (await Major.findOne({name: major})).id
/*
    const duplicateUser = await User.findOne({email})
    if (duplicateUser !== null) {
      console.log("email exists already")
      res.status(409).json({"error": "email already exists"})
      return
    }
*/

    // I'm going to comment out the fields that need to be updated during onboarding since this post is made at signup time which is just email and password
    // Onboarding needs to create a new router to include the onboarding data which will come after verify - Bryce
    // If you want to test everything at once just get rid of my comments
    // store object in database (doesn't need to have all fields)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({
      //username,
      email,
      passwordHash,
      //graduationSemester,
      //major: majorId,
      verificationCode,
      codeExpires: new Date(Date.now() + 10 * 60 * 1000),
      isVerified: false,
      reviews: [],
      likedReviews: [],
      plans: []
    })
    const savedUser = await user.save()
    console.log("Attempting to send email to:", email)
    console.log("Verification code:", verificationCode)
    console.log("EMAIL_USER:", process.env.EMAIL_USER)
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS)
    await sendEmail(email, verificationCode)
    res.status(201).end()
  }
  catch (err) {
    // catches major not existing (error) and bad requests
    console.log("an error occured while creating user")
    res.status(400).json({"error": "bad request"})
  }
})

usersRouter.post('/verify', async (req, res) => {
  const {email, code} = req.body

  try {
    const user = await User.findOne({
      email,
      verificationCode: code,
      codeExpires: { $gt: Date.now() }
    })
    if (!user) {
      return res.status(400).json({error: "Invalid or Expired Code"})
    }
    user.isVerified = true
    user.verificationCode = null
    user.codeExpires = null
    await user.save()
    res.status(200).json({message: "Email verified successfully"})
  } catch (error) {
    console.log("Failed to verify email", error)
    res.status(400).json({error: "Bad request"})
  }
})

usersRouter.get('/', async (req, res) => {
})

module.exports = usersRouter