const mongoose = require('mongoose')

const instructorSchema = new mongoose.Schema({
    instructorID: Number,
    instructorName: String,
    gpa: Number,
    rmp: Number,
    rmpLin: String
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