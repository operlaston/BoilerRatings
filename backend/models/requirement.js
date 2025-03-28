const mongoose = require('mongoose')

const requirementSchema = new mongoose.Schema({
  name: String,
  courses: [{type: [{type: String}]}],
})

requirementSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    if (!returnedObject._id) return
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Requirement = mongoose.Model('Requirement', requirementSchema)

module.exports = Requirement