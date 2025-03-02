const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    courseName: String,
    courseId: Number,
    courseNumber: String,
    description: String,
    instructors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor'
    }],
    difficulty: {
        type: Number,
        default: 0
    },
    enjoyment: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    recommended: {
        type: Number,
        default: 0
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    prerequisites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    requirements: [String],
    creditHours: Number,
})

courseSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

const Course = mongoose.model('Course', courseSchema)
module.exports = Course