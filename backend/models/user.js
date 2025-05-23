const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  passwordHash: String,
  isVerified: Boolean,
  verificationCode: String,
  codeExpires: Date,
  graduationSemester: String,
  banned: {
    type: Boolean,
    default: false
  },
  major: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Major'
  }],
  minor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Major'
  }],
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  plans: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DegreePlan'
  }],
  favorited: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  likedReviews: [
      {
          review: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Review'
          },
          favorability: Number
      }
  ],
  flag: {
    type: Boolean,
    default: false
  },
  flagReason: {
    type: String,
    default: ""
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  admin: {
    type: Boolean,
    default: false
  }
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    if (!returnedObject._id) return
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const User = mongoose.model('User', userSchema)
module.exports = User