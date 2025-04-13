const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Major = require('../models/major')
const Review = require('../models/review')
const Course = require('../models/course')
const sendEmail = require('../utils/email')
const { findById, findByIdAndUpdate } = require('../models/course')
const {to} = require('await-to-js')


usersRouter.post('/', async (req, res) => {
  //const { username, email, password, graduationSemester, major } = req.body
  const {email, password} = req.body
  try {
    // search db for major

    //const majorId = (await Major.findOne({name: major})).id

    const dupEmailUser = await User.findOne({email})
    if (dupEmailUser !== null) {
      console.log("email exists already")
      return res.status(409).json({"error": "email already exists"})
    }

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
      plans: [],
      lastLogin: Date.now,
      banned: false, 
      admin: false
    })
    const savedUser = await user.save()
    await sendEmail(email, verificationCode)
    res.status(200).json(savedUser)
  }
  catch (err) {
    // catches major not existing (error) and bad requests
    console.log("an error occured while creating user", err)
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

  // first check if username exists already
  const duplicateUsername = await User.findOne({username})
  if (duplicateUsername !== null) {
    console.log("username already exists")
    return res.status(409).json({error: "this username already exists"})
  }

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

usersRouter.get('/:id', async (req, res) => {
  //Do not populate email and password
  id = req.params.id;
  try {
    const user = await User.findById(id).select('-email -passwordHash')
      .populate('reviews')
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error",error);
    res.status(404).json({message: 'Bad Request'})
  }
})

// update account
usersRouter.put('/update/:id', async (req, res) => {
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

// "delete" user by changing their email and username to "deleted user"
usersRouter.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean()
    if (user === null) {
      res.status(404).json({error: 'user not found'})
    }
    const updatedUser = {
      ...user,
      email: "deletedUser",
      username: "[deleted]"
    }
    const returnedUser = await User.findByIdAndUpdate(req.params.id, updatedUser, {new: true})
    res.status(200).json(returnedUser)
  }
  catch (e) {
    console.error(e);
    res.status(500).json({error: 'server error'})
  }
})

// retrieve a user by their username
usersRouter.get('/username/:username', async (req, res) => {
  const username = req.params.username
  const [error, user] = await to(User.findOne({username: username}).populate('major').populate({path: 'reviews', populate: {path: 'course'}}))
  if (error) {
    console.error(error)
    return res.status(500).json({error: 'server error'})
  }
  if (user === null) {
    return res.status(404).json({error: 'user not found'})
  }
  res.status(200).json(user)
})

usersRouter.put('/favorite/:id', async (req, res) => {
  const { courseId } = req.body;
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({error: 'User Not Found'})
    }

    return res.status(200).json(user.favorited.includes(courseId))
  } catch (err) {
    return res.status(400).json({error: "Bad Request"})
  }
})

usersRouter.post('/ban/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({error: "User not found"})
    }
    const user = await User.findByIdAndUpdate(userId, {$set: {banned: true}})

    // remove all of their reviews
    user.reviews.forEach(async (review) => {
      const rev = Review.findById(review._id);
      if (rev !== null) {
        // only need to remove review from the course
        await Course.findByIdAndUpdate(rev.course, {
          $pull: {reviews: rev.id}
        })
        await Review.findOneAndDelete(rev);
      }
    });

    return res.status(200).json({message: "User successfully banned"})
  }
  catch (err) {
    return res.status(401).json({error: "Bad Request"})
  }
})

// this is only for testing the backend without having to create an account through the frontend
usersRouter.post('/test/add', async (req, res) => {
  const {username, email, password, graduationSemester} = req.body;
  const saltRounds = 10
  try {
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({
      username,
      email,
      passwordHash,
      graduationSemester,
      major: [],
      reviews: [],
      plans: [],
      likedReviews: [],
      isVerified: true
    })
    const savedUser = await user.save()
    res.status(201).json(savedUser)
  }
  catch (e) {
    console.error(e)
    res.status(500).json({"error": "server error"})
  }
})
/* Writing this route to put every users flag as false and giving them an empty reason */
/* Should not have to use this ever again*/
usersRouter.put('/test/flagfalse', async (req, res) => {
  try {
    await User.updateMany({}, {$set: { 
      flag: false,
      flagReason: ""
    }})
    res.status(200).json("Worked")
  } catch (error) {
    res.status(400).json({"error": "server error"})
  }
})

/* Puts a flag on the user */
usersRouter.put('/flags/:id', async (req, res) => {
  const userId = req.params.id;
  const {bool, reason} = req.body
  try {
    const user = await User.findByIdAndUpdate(userId, 
      {$set: {
        flag: bool,
        flagReason: reason
      }}, {new:true}
    )
    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({"error": "Bad request"})
  }
})


module.exports = usersRouter