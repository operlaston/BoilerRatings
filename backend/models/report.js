const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
    reportId: Number,
    //ADD UID WHEN DISCORD RESPONDS
    //What should the enum be? 
    reportContent: String,
    isResolved: Boolean
}, { timestamps: true})

reportSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

const Report = mongoose.model('Report', reportSchema)
module.exports = Report