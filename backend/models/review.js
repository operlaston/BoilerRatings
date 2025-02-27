const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    reviewID: Number,
    // We will add this when people resond on discord userID: num
    date: Date,
    semesterTaken: String,
    reviewContent: String,
    recommend: Boolean,
    difficulty: Number,
    enjoyment: Number,
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor'
    },
    likes: Number,
    reports: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Report'
    }]
})

reviewSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

const Review = mongoose.model('Review', reviewSchema)
module.exports = Review