require('dotenv').config()
const ReviewManager = require('../controllers/reviewManager')
const Review = require('../models/review')
const User = require('../models/user');
const Major = require('../models/major');
const mongoose = require('mongoose')

// mock express
const { mockRequest, mockResponse } = require('jest-mock-req-res')

var res = mockRequest()
var req = mockResponse()

// test items
const major = new Major({
    name: "Engineering",
    requirements: []
})

const user = new User({
    username: "John123",
    email: "johndoe@purdue.edu",
    passwordHash: "aifua",
    isVerified: true,
    graduationSemester: "Spring2027",
    major: major,
    reviews: [],
    plans: [],
    likedReviews: [],
})

const r = new Review({
    user: new User(),
    date: Date.now(),
    semesterTaken: "Fall2024",
    reviewContent: "This is a test string",
    recommend: true,
    difficulty: 4,
    enjoyment: 3,
    likes: 0,
    reports: []
})

// each 'describe' is a different section of testing
describe('Edit Review', () => {
    // redefine variables and connect to mongoose before each test
    beforeEach(async () => {
        req = mockRequest()
        res = mockResponse({
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        })
        await mongoose.connect(process.env.MONGODB_URI)
    })

    // after test, disconnect from mongoose
    afterEach(async () => {
        mongoose.disconnect()
    })

    // each 'it' function is a different test
    // over-commented to show how to do it
    it('Proper Input', async () => {
        // make, then get a mock review
        const ret = await Review.insertOne(r)
        const review = await Review.findById(ret._id)
        // duplicate review then edit text
        const newReview = new Review(review)
        const newText = "This is a new test review!"
        newReview.reviewContent = newText
        // modify req for input
        req.body = review._id + "||" + JSON.stringify(newReview)
        // call function
        await ReviewManager.editReview(req, res)
        // check if function called res.status(200) 'success'
        expect(res.status).toBeCalledWith(200)
    })

    it('Bad Request', async () => {
        req.body = null + "||" + JSON.stringify(r)
        await ReviewManager.editReview(req, res)
        expect(res.status).toBeCalledWith(400)
    })

    it('Bad Request 2', async () => {
        req.body = r._id + "||" + null
        await ReviewManager.editReview(req, res)
        expect(res.status).toBeCalledWith(400)
    })

    it('Review Not Found', async () => {
        req.body = new mongoose.Types.ObjectId(0) + "||" + JSON.stringify(r)
        await ReviewManager.editReview(req, res)
        expect(res.status).toBeCalledWith(401)
    })
})

describe('Delete Review', () => {
    beforeEach(async () => {
        req = mockRequest()
        res = mockResponse({
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        })
        await mongoose.connect(process.env.MONGODB_URI)
    })

    afterEach(async () => {
        await mongoose.disconnect()
    })

    it('Proper Input', async () => {
        req.body = r._id
        await ReviewManager.deleteReview(req, res)
        expect(res.status).toBeCalledWith(200)
    })

    it('Bad Request', async () => {
        req.body = "testing my bad id!"
        await ReviewManager.deleteReview(req, res)
        expect(res.status).toBeCalledWith(400)
    })

    it('Review Not Found', async () => {
        req.body = new mongoose.Types.ObjectId(0)
        await ReviewManager.deleteReview(req, res)
        expect(res.status).toBeCalledWith(401)
    })
})

const s = new Review({
    user: new User(),
    date: Date.now(),
    semesterTaken: "Fall2024",
    reviewContent: "This is a test string 2",
    recommend: true,
    difficulty: 4,
    enjoyment: 3,
    likes: 0,
    reports: []
})

describe('Like Review', () => {
    beforeEach(async () => {
        req = mockRequest()
        res = mockResponse({
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        })
        await mongoose.connect(process.env.MONGODB_URI)
    })

    afterEach(async () => {
        await mongoose.disconnect()
    })

    it('Liking unliked review', async () => {
        var ret = await Review.insertOne(s)
        var use = await User.findOne({username: "John123"})
        expect(ret.likes).toBe(0)
        req.body = use._id + "||" + ret._id
        await ReviewManager.likeReview(req, res)
        var newR = await Review.findById(ret._id)
        expect(newR.likes).toBe(1)
        expect(res.status).toBeCalledWith(200)
        // delete test review
        req.body = newR._id
        ReviewManager.deleteReview(req, res)
    })

    it('Liking liked review', async () => {
        var ret = await Review.insertOne(s)
        var use = await User.findOne({ username: "John123" })
        await User.findByIdAndUpdate(use._id, { $set: { 'likedReviews': [] } })
        await Review.findByIdAndUpdate(ret._id, { $set: { 'likes': 0 }})
        expect(ret.likes).toBe(0)
        req.body = use._id + "||" + ret._id
        await ReviewManager.likeReview(req, res)
        var newR = await Review.findById(ret._id)
        expect(newR.likes).toBe(1)
        expect(res.status).toBeCalledWith(200)
        await ReviewManager.likeReview(req, res)
        newR = await Review.findById(ret._id)
        expect(newR.likes).toBe(0)
        expect(res.status).toBeCalledWith(200)
        // delete test review
        req.body = newR._id
        ReviewManager.deleteReview(req, res)
    })

    it('Liking disliked review', async () => {
        var ret = await Review.insertOne(s)
        var use = await User.findOne({ username: "John123" })
        await User.findByIdAndUpdate(use, { $set: { 'likedReviews': [{ review: ret._id, favorability: -1 }] } })
        await Review.findOneAndUpdate(ret, { $set: { 'likes': -1 } }, { returnNewDocument: true })
        var newR = await Review.findById(ret._id)
        expect(newR.likes).toBe(-1)
        req.body = use._id + "||" + ret._id
        await ReviewManager.likeReview(req, res)
        ret = await Review.findById(newR._id)
        expect(ret.likes).toBe(1)
        expect(res.status).toBeCalledWith(200)
        // delete test review
        req.body = ret._id
        ReviewManager.deleteReview(req, res)
    })

    it('Review Not Found', async () => {
        var use = await User.findOne({ username: "John123" })
        req.body = use._id + "||" + new mongoose.Types.ObjectId(0)
        await ReviewManager.likeReview(req, res)
        expect(res.status).toBeCalledWith(401)
        expect(res.json).toBeCalledWith({ "error": "review not found" })
    })

    it('User Not Found', async () => {
        var ret = await Review.insertOne(s)
        req.body = new mongoose.Types.ObjectId(0) + "||" + ret._id
        await ReviewManager.likeReview(req, res)
        expect(res.status).toBeCalledWith(401)
        expect(res.json).toBeCalledWith({ "error": "user not found" })
        // delete test review
        req.body = ret._id
        ReviewManager.deleteReview(req, res)
    })

    it('Bad Request', async () => {
        req.body = null
        await ReviewManager.likeReview(req, res)
        expect(res.status).toBeCalledWith(400)
    })
})

describe('Dislike Review', () => {
    beforeEach(async () => {
        req = mockRequest()
        res = mockResponse({
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        })
        await mongoose.connect(process.env.MONGODB_URI)
    })

    afterEach(async () => {
        await mongoose.disconnect()
    })

    it('Disliking unliked review', async () => {
        var ret = await Review.insertOne(s)
        var use = await User.findOne({ username: "John123" })
        await User.findByIdAndUpdate(use._id, { $set: { 'likedReviews': [] } })
        await Review.findByIdAndUpdate(ret._id, { $set: { 'likes': 0 } })
        expect(ret.likes).toBe(0)
        req.body = use._id + "||" + ret._id
        await ReviewManager.dislikeReview(req, res)
        var newR = await Review.findById(ret._id)
        expect(newR.likes).toBe(-1)
        expect(res.status).toBeCalledWith(200)
        // delete test review
        req.body = newR._id
        ReviewManager.deleteReview(req, res)
    })

    it('Disliking liked review', async () => {
        var ret = await Review.insertOne(s)
        var use = await User.findOne({ username: "John123" })
        await User.findByIdAndUpdate(use._id, { $set: { 'likedReviews': [] } })
        await Review.findByIdAndUpdate(ret._id, { $set: { 'likes': 0 } })
        expect(ret.likes).toBe(0)
        req.body = use._id + "||" + ret._id
        await ReviewManager.dislikeReview(req, res)
        var newR = await Review.findById(ret._id)
        expect(newR.likes).toBe(-1)
        expect(res.status).toBeCalledWith(200)
        await ReviewManager.dislikeReview(req, res)
        newR = await Review.findById(ret._id)
        expect(newR.likes).toBe(0)
        expect(res.status).toBeCalledWith(200)
        // delete test review
        req.body = newR._id
        ReviewManager.deleteReview(req, res)
    })

    it('Disliking liked review', async () => {
        var ret = await Review.insertOne(s)
        var use = await User.findOne({ username: "John123" })
        await User.findByIdAndUpdate(use, { $set: { 'likedReviews': [{ review: ret._id, favorability: 1 }] } })
        await Review.findOneAndUpdate(ret, { $set: { 'likes': 1 } }, { returnNewDocument: true })
        var newR = await Review.findById(ret._id)
        expect(newR.likes).toBe(1)
        req.body = use._id + "||" + ret._id
        await ReviewManager.dislikeReview(req, res)
        ret = await Review.findById(newR._id)
        expect(ret.likes).toBe(-1)
        expect(res.status).toBeCalledWith(200)
        // delete test review
        req.body = ret._id
        ReviewManager.deleteReview(req, res)
    })

    it('Review Not Found', async () => {
        var use = await User.findOne({ username: "John123" })
        req.body = use._id + "||" + new mongoose.Types.ObjectId(0)
        await ReviewManager.dislikeReview(req, res)
        expect(res.status).toBeCalledWith(401)
        expect(res.json).toBeCalledWith({ "error": "review not found" })
    })

    it('User Not Found', async () => {
        var ret = await Review.insertOne(s)
        req.body = new mongoose.Types.ObjectId(0) + "||" + ret._id
        await ReviewManager.dislikeReview(req, res)
        expect(res.status).toBeCalledWith(401)
        expect(res.json).toBeCalledWith({ "error": "user not found" })
        // delete test review
        req.body = ret._id
        ReviewManager.deleteReview(req, res)
    })

    it('Bad Request', async () => {
        req.body = null
        await ReviewManager.dislikeReview(req, res)
        expect(res.status).toBeCalledWith(400)
    })
})