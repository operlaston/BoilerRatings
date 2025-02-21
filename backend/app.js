// imports
require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')

// connect to database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB database')
  })
  .catch((err) => {
    console.log('failed to connect to database: ' + err)
  })

app.use()
mongoose.connection.close()