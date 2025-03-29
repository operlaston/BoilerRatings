const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    content: String,
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    },
    isResolved: Boolean
}, { timestamps: true})

reportSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      if (!returnedObject._id) return
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

const Report = mongoose.model('Report', reportSchema)
module.exports = Report