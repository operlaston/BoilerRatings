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
    difficulty: Number,
    enjoyment: Number,
    numReviews: Number,
    recommended: Number,
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