const mongoose = require('mongoose')

const pageReportSchema = new mongoose.Schema({
    page: String,
    reportContent: String
})

pageReportSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        if (!returnedObject._id) return
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
      }
})

const pageReport = mongoose.model('PageReport', pageReportSchema)
module.exports = pageReport