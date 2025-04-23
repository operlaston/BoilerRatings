const mongoose = require('mongoose')

const pageReportSchema = new mongoose.Schema({
    page: String,
    reportContent: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isResolved: {
        type: Boolean,
        default: false
    }
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