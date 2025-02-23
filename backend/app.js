// imports
require('dotenv').config()
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const authController = require("./controllers/authoController")

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

const PORT = 5000; //We can change this in the .env file later if we want a differnt port just put this for testing
app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`)
})

app.post("/api/auth/signup", authController.signup)
app.post("/api/auth/verify-code", authController.verifyCode)

module.exports = app