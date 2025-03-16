// imports
require('dotenv').config()
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
const { requestLogger, unknownEndpoint } = require('./utils/middleware')
const app = express()

// connect to database
mongoose.connect(process.env.MONGODB_URI)
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

app.use(unknownEndpoint)



module.exports = app