// imports
require('dotenv').config()
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const usersRouter = require('./controllers/users')
const majorsRouter = require('./controllers/majors')
const loginRouter = require('./controllers/login')
const reviewRouter = require('./controllers/review')
const courseRouter = require('./controllers/course')
const { requestLogger, unknownEndpoint } = require('./utils/middleware')
const degreePlanRouter = require('./controllers/degreeplan')
const instructorRouter = require('./controllers/instructor')
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