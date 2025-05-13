const mongoose = require('mongoose')

const requirementSchema = new mongoose.Schema({
  name: {type: String, required: true},
  subrequirements: [{
    credits: {type: Number, required: true},
    courses: [{
      type: String, required: true 
    }]
  }],
})

requirementSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    if (!returnedObject._id) return
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Requirement = mongoose.model('Requirement', requirementSchema)

module.exports = Requirement