const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Major = require('../models/major')
const sendEmail = require('../utils/email')
const { findById, findByIdAndUpdate } = require('../models/course')

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
      codeExpires: new Date(Date.now() + 10 * 60 * 1000 ),
      isVerified: false,
      reviews: [],
      likedReviews: [],
      plans: []
    })
    const savedUser = await user.save()
    await sendEmail(email, verificationCode)
    res.status(200).json(savedUser)
  }
  catch (err) {
    // catches major not existing (error) and bad requests
    console.log("an error occured while creating user")
    res.status(400).json({"error": "bad request"})
  }
})

usersRouter.post('/verify', async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user.codeExpires < Date.now()) {
      await User.deleteOne({ _id: user._id });
      return res.status(400).json({
        error: "Verification code expired",
        deleted: true
      });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ error: "Invalid code" });
    }
    const newUser = await User.findByIdAndUpdate(
      user._id, 
      {
        $set: {
          isVerified: true,
          verificationCode: null,
          codeExpires: null
        }
      },
      { new: true }
    );
    console.log("Returning", newUser)
    res.status(200).json(newUser);
  } catch (error) {
    console.log("Failed to verify email", error)
    res.status(400).json({error: "Bad request"})
  }
})

usersRouter.post('/:id', async (req, res) => {
  const {username, majors, minors, gradSemester} = req.body;
  const uid = req.params.id
  console.log(majors, minors)
  const cleanedMajors = majors.map((major) => {
    return major.id
  })
  const cleanedMinors = minors.map((minor) => {
    return minor.id
  })
  console.log(cleanedMajors, cleanedMinors)
  try {
    const user = await User.findByIdAndUpdate(uid, {
      major: cleanedMajors,
      minor: cleanedMinors,
      graduationSemester: gradSemester,
      username: username
    }, { new: true, runValidators: true });
    console.log(user)
    res.status(200).json(user)
  } catch (error) {
    console.log("Failed to onboard user")
    res.status(400).json({error: "Bad request"})
  }
})

usersRouter.get('/', async (req, res) => {
})

// update account
usersRouter.put('/', async (req, res) => {
    const { username, majors, minors, gradSemester } = req.body
    const userID = req.params.id
    try {
        const user = await User.findById(userID)
        if (user == null) {
            return res.status(401).json({ "error": "user not found" })
        }
        await User.findByIdAndUpdate(userID, { $set: { username: username, major: majors, minor: minors, graduationSemester: gradSemester } })
        return res.status(200).json({"message": "account updated"})
    }
    catch (err) {
        return res.status(400).json({ "error": "bad request"})
    }
})

module.exports = usersRouter