const {beforeEach, after, test} = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const Review = require('../models/review')
const Major = require('../models/major')
const Course = require('../models/course')
const User = require('../models/user')
const Requirement = require('../models/requirement')

const api = supertest(app)


beforeEach(async () => {
  await Review.deleteMany({})
  await Major.deleteMany({})
  await Course.deleteMany({})
  await User.deleteMany({})
  await Requirement.deleteMany({})
  console.log('cleared')
})

test('a valid course can be added', async () => {
  const newCourse = {
    name: "testcourse",
    number: "testnumber",
    description: "testdescription",
    instructors: [],
    difficulty: 0,
    enjoyment: 0,
    recommended: 0,
    reviews: [],
    prerequisites: [],
    creditHours: 0,
    conflicts: []
  }

  const coursesBefore = await Course.find({})

  await api
    .post('/api/courses')
    .send(newCourse)
    .expect(201)

  const coursesAfter = await Course.find({})
  assert.strictEqual(coursesAfter.length, coursesBefore.length + 1)
  assert(coursesAfter.map(course => course.number).includes("testnumber"))
})

test('a valid user can be added through the test add route', async () => {
  const newUser = {
    username: "testusername",
    email: "testemail",
    password: "testpassword",
    graduationSemester: "testsemester",
  }

  const usersBefore = await User.find({})

  await api
    .post('/api/users/test/add')
    .send(newUser)
    .expect(201)

  const usersAfter = await User.find({})
  assert.strictEqual(usersAfter.length, usersBefore.length + 1)
  assert(usersAfter.map(user => user.username).includes("testusername"))
})

test('a valid review can be added', async () => {
  const newCourse = {
    name: "testcourse",
    number: "testnumber",
    description: "testdescription",
    instructors: [],
    difficulty: 0,
    enjoyment: 0,
    recommended: 0,
    reviews: [],
    prerequisites: [],
    creditHours: 0,
    conflicts: []
  }

  const courseRes = await api
    .post('/api/courses')
    .send(newCourse)
    .expect(201)

  const courseid = courseRes.body.id

  const newUser = {
    username: "testusername",
    email: "testemail",
    password: "testpassword",
    graduationSemester: "testsemester",
  }

  const userRes = await api
    .post('/api/users/test/add')
    .send(newUser)
    .expect(201)

  const userid = userRes.body.id

  const newReview = {
    date: new Date(),
    semesterTaken: "testsemester",
    reviewContent: "testcontent",
    recommend: false,
    anon: false,
    difficulty: 0,
    enjoyment: 0,
    likes: 0,
    reports: [],
    hidden: false
  }

  const reviewsBefore = await Review.find({})

  await api
    .post('/api/reviews')
    .send({review: newReview, course: courseid, userId: userid})
    .expect(201)

  const reviewsAfter = await Review.find({})
  assert.strictEqual(reviewsAfter.length, reviewsBefore.length + 1)
  assert(reviewsAfter.map(review => review.reviewContent).includes("testcontent"))

})

test('testing user deletion', async () => {
  const newUser = {
    username: "testuser",
    email: "testemail",
    password: "testpassword",
    graduationSemester: "testsemester"
  }

  await api
    .post('/api/users/test/add')
    .send(newUser)
  
  
  const userBefore = await User.findOne({username: "testuser"})
  assert(userBefore !== null)
  
  await api
    .delete(`/api/users/${userBefore._id}`)
    .expect(200)

  const userAfter = await User.findOne({username: "testuser"})
  assert(userAfter === null)

  const response = await api.get(`/api/users/${userBefore._id}`).expect(200)
  const deletedUser = response.body
  assert(deletedUser.username === "[deleted]")
})

test('a valid requirement can be added ', async () => {
  const newRequirement = {
    name: 'testrequirement',
    subrequirements: [
      {
        credits: 6,
        courses: ["testcourse1", "testcourse2"]
      }
    ]
  }

  const initialRequirements = await Requirement.find({})

  await api
    .post('/api/requirements')
    .send(newRequirement)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const requirementsInDb = await Requirement.find({})
  assert.strictEqual(requirementsInDb.length, initialRequirements.length + 1)

  const names = requirementsInDb.map(req => req.name)
  assert(names.includes('testrequirement'))
})

test('a valid major can be added ', async () => {

  const newRequirement = {
    name: 'testrequirementformajor',
    subrequirements: [
      {
        credits: 6,
        courses: ["testcourse1", "testcourse2"]
      }
    ]
  }

  const response = await api.post('/api/requirements').send(newRequirement)

  const returnedRequirement = response.body

  // console.log(returnedRequirement)

  const newMajor = {
    name: 'testmajor',
    requirements: [returnedRequirement.id]
  }

  const initialMajors = await Major.find({})

  await api
    .post('/api/majors')
    .send(newMajor)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const majorsAtEnd = await Major.find({}).lean()
  assert.strictEqual(majorsAtEnd.length, initialMajors.length + 1)

  assert(majorsAtEnd.find(major => major.name === 'testmajor') 
    && majorsAtEnd.find(major => major.requirements.length === 1) 
    && majorsAtEnd.find(major => major.requirements[0] == returnedRequirement.id))
})

after(async () => {
  await mongoose.connection.close()
})