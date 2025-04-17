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

const newUser = {
  username: "testusername",
  email: "testemail",
  password: "testpassword",
  graduationSemester: "testsemester",
}

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

const newRequirement = {
  name: 'testrequirement',
  subrequirements: [
    {
      credits: 6,
      courses: ["testnumber", "testcourse2"]
    }
  ]
}

const newMajor = {
  name: 'testmajor',
  requirements: []
}

beforeEach(async () => {
  await Review.deleteMany({})
  await Major.deleteMany({})
  await Course.deleteMany({})
  await User.deleteMany({})
  await Requirement.deleteMany({})
  console.log('cleared')
})

test('a valid course can be added', async () => {

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

  const courseRes = await api
    .post('/api/courses')
    .send(newCourse)
    .expect(201)

  const courseid = courseRes.body.id

  const userRes = await api
    .post('/api/users/test/add')
    .send(newUser)
    .expect(201)

  const userid = userRes.body.id

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

  const res = await api
    .post('/api/users/test/add')
    .send(newUser)
  
  const userBefore = await User.findOne({username: "testusername"})
  assert(userBefore !== null)
  
  await api
    .delete(`/api/users/${userBefore._id}`)
    .expect(200)

  const userAfter = await User.findOne({username: "testusername"})
  assert(userAfter === null)

  const response = await api.get(`/api/users/${userBefore._id}`).expect(200)
  const deletedUser = response.body
  assert(deletedUser.username === "[deleted]")
})

test('a valid requirement can be added ', async () => {

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

  const initialMajors = await Major.find({})

  await api
    .post('/api/majors')
    .send(newMajor)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const majorsAtEnd = await Major.find({}).lean()
  assert.strictEqual(majorsAtEnd.length, initialMajors.length + 1)

  assert(majorsAtEnd.find(major => major.name === 'testmajor'))
})

test('a favorited course is added to the user\'s favorited array', async () => {
  let res = await api
    .post('/api/courses')
    .send(newCourse)

  const courseid = res.body.id

  res = await api
    .post('/api/users/test/add')
    .send(newUser)
  
  const userid = res.body.id

  res = await api
    .put(`/api/courses/favorite/${courseid}`)
    .send({userId: userid})

  const user = await User.findById(userid)
  assert(user.favorited.map(fav => fav.toString()).includes(courseid))
})

test('a review can be deleted', async () => {
  const courseRes = await api
    .post('/api/courses')
    .send(newCourse)
    .expect(201)
  const courseId = courseRes.body.id

  const userRes = await api
    .post('/api/users/test/add')
    .send(newUser)
    .expect(201)
  const userId = userRes.body.id

  const reviewRes = await api
    .post('/api/reviews')
    .send({ review: newReview, course: courseId, userId })
    .expect(201)
  const reviewId = reviewRes.body.id

  let reviewInDb = await Review.findById(reviewId)
  assert(reviewInDb !== null)

  await api
    .delete(`/api/reviews/${reviewId}`)
    .expect(200)

  reviewInDb = await Review.findById(reviewId)
  assert(reviewInDb === null)
})

test('a user can be banned', async () => {
  const res = await api
    .post('/api/users/test/add')
    .send(newUser)
  
  const userBefore = await User.findOne({username: "testusername"})
  assert(userBefore !== null)
  assert(userBefore.banned === false)

  await api
    .post(`/api/users/ban/${userBefore._id}`)
    .expect(200)

  const userAfter = await User.findOne({username: "testusername"})
  assert(userAfter !== null)
  assert(userAfter.banned === true)
})

test('a requirement can be added to a major', async () => {
  const requirementRes = await api.post('/api/requirements').send(newRequirement)
  const majorRes = await api.post('/api/majors').send(newMajor)
  await api
    .put(`/api/majors/addrequirement/${majorRes.body.id}`)
    .send({newRequirementId: requirementRes.body.id})
    .expect(200)

  const newMajorRes = await api
    .get(`/api/majors/${majorRes.body.id}`)
    .expect(200)
  
  assert(newMajorRes.body.requirements.length === 1)
})

test('a requirement can be deleted and is deleted from any majors it is part of', async () => {

  let requirementRes = await api.post('/api/requirements').send(newRequirement)
  let majorRes = await api.post('/api/majors').send(newMajor)
  await api
    .put(`/api/majors/addrequirement/${majorRes.body.id}`)
    .send({newRequirementId: requirementRes.body.id})
    .expect(200)

  majorRes = await api
    .get(`/api/majors/${majorRes.body.id}`)
    .expect(200)

  const majorBefore = majorRes.body

  await api
    .delete(`/api/requirements/${requirementRes.body.id}`)

  majorRes = await api
    .get(`/api/majors/${majorRes.body.id}`)
    .expect(200)

  await api
    .get(`/api/requirements/${requirementRes.body.id}`)
    .expect(404)

  const majorAfter = majorRes.body
  assert(majorAfter.requirements.length === majorBefore.requirements.length - 1)
})

test('the prerequisites of a course are updated properly', async () => {
  let courseRes = await api.post('/api/courses').send(newCourse)
  const newPrerequisites = [
    ["a", "b"],
    ["c", "d"]
  ]
  assert(courseRes.body.prerequisites.length === 0)
  await api.put(`/api/courses/prerequisite/${courseRes.body.id}`).send({newPrerequisites}).expect(200)
  courseRes = await api.get(`/api/courses/byid/${courseRes.body.id}`)
  const course = courseRes.body
  assert(course.prerequisites.length === newPrerequisites.length)
  assert(JSON.stringify(course.prerequisites) === JSON.stringify(newPrerequisites))
})

test('deleting a course deletes the references to it in requirements', async () => {
  let res = await api.post(`/api/courses`).send(newCourse)
  const course = res.body
  res = await api.post(`/api/requirements`).send(newRequirement)
  let requirement = res.body
  assert(requirement.subrequirements[0].courses.length === newRequirement.subrequirements[0].courses.length)
  await api.delete(`/api/courses/${course.id}`).expect(204)
  res = await api.get(`/api/requirements/${requirement.id}`)
  requirement = res.body
  assert(requirement.subrequirements[0].courses.length === newRequirement.subrequirements[0].courses.length - 1)
  await api.get(`/api/courses/byid/${course.id}`).expect(404)
})

after(async () => {
  await mongoose.connection.close()
})
