const mongoose = require('mongoose')

const majorSchema = new mongoose.Schema({
  name: String,
  requirements: [{type: mongoose.Schema.Types.ObjectId, ref: 'Requirement'}]
})

majorSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    if (!returnedObject._id) return
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Major = mongoose.model('Major', majorSchema)
module.exports = Major