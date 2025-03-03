const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

// client should send an object with an email field and password field
loginRouter.post('/', async (req, res) => {
  const userCredentials = req.body
  const userEmail = userCredentials.email
  try {
    const user = await User.findOne({email: userEmail})
    if (user === null) {
      res.status(401).json({"error": "email is not registered"})
      return
    }
    if (await bcrypt.compare(userCredentials.password, user.passwordHash)) {
      console.log("Login success:", userEmail)
      res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        graduationSemester: user.graduationSemester,
        major: user.major,
        reviews: user.reviews,
        likedReviews: user.likedReviews,
        plans: user.plans
      })
    }
    else {
      console.log("Login failed")
      res.status(401).json({"error": "incorrect password"})
    }
  }
  catch (err) {
    console.log("Login failed:", err)
    res.status(400).json({"error": "bad request"})
  }
})

module.exports = loginRouter