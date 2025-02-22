// imports
require('dotenv').config()
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
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


module.exports = app