const { test, after, beforeEach } = require('node:test')
const Major = require('../models/major')
const Requirement = require('../models/requirement')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)



beforeEach(async () => {
  await Requirement.deleteMany({})
  await Major.deleteMany({})
  console.log('cleared')
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