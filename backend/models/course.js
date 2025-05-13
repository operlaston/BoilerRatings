const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    name: String,
    number: String,
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
    recommended: {
        type: Number,
        default: 0
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    prerequisites: [[String]],
    creditHours: Number,
    conflicts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    timeToReview: {
        type: Date,
        default: Date.now
    }
})

courseSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.enjoyment = Math.round(returnedObject.enjoyment * 100) / 100
        returnedObject.difficulty = Math.round(returnedObject.difficulty * 100) / 100
        if (!returnedObject._id) return
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Course = mongoose.model('Course', courseSchema)
module.exports = Course