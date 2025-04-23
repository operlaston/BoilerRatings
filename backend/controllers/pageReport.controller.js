const pageReportRouter = require('express').Router()
const pageReport = require('../models/pagereport')
/* Saves a page report */
pageReportRouter.post('/', async (req, res) => {
    const {page, reportContent} = req.body
    const report = new pageReport({
        page: page,
        reportContent: reportContent
    })
    try {
        await report.save();
        res.status(200).json("Saved Report")
    } catch (error) {
        res.status(400).json({error: "Bad request"})
    }
})
/* Gets all the page reports*/
pageReportRouter.get('/', async (req, res) => {
    try {
        const pageReports = await pageReport.find({})
        res.status(201).json(pageReports)
    } catch (error) {
        res.status(400).json({"errro": "Server error"})
    }
})

pageReportRouter.delete('/:id', async (req, res) => {
    try {
        const pageReportToDelete = await pageReport.findByIdAndDelete(req.params.id)
        res.status(200).json("Deleted")
    } catch (error) {
        res.status(400).json({"error": "Server error"})
    }
})

module.exports = pageReportRouter