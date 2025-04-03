// imports
const config = require('./utils/config')
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const usersRouter = require('./controllers/user.controller')
const majorsRouter = require('./controllers/major.controller')
const loginRouter = require('./controllers/login.controller')
const reviewRouter = require('./controllers/review.controller')
const courseRouter = require('./controllers/course.controller')
const degreePlanRouter = require('./controllers/degreeplan.controller')
const instructorRouter = require('./controllers/instructor.controller')
const requirementRouter = require('./controllers/requirement.controller')
const calamityRouter = require('./controllers/thegreatcalamity')
const { requestLogger, unknownEndpoint } = require('./utils/middleware')
const app = express()

// connect to database
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB database')
  })
  .catch((err) => {
    console.log('failed to connect to database: ' + err)
  })

app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.use('/api/users', usersRouter)
app.use('/api/majors', majorsRouter)
app.use('/api/login', loginRouter)
app.use('/api/reviews', reviewRouter)
app.use('/api/courses', courseRouter)
app.use('/api/degreeplans', degreePlanRouter)
app.use('/api/instructors', instructorRouter)
app.use('/api/requirements', requirementRouter)
// app.use('/api/intercontinentalballisticmissile', calamityRouter)

app.use(unknownEndpoint)



module.exports = app