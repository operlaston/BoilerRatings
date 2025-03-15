const mongoose = require('mongoose')

const instructorSchema = new mongoose.Schema({
    name: String,
    gpa: Number,
    rmp: Number,
    rmpLink: String,
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }]
})

instructorSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        if (!returnedObject._id) return
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
      }
})

const Instructor = mongoose.model('Instructor', instructorSchema)
module.exports = Instructor