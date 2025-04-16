const courseRouter = require('express').Router()
const { populate } = require('../models/review')
const Course = require('../models/course')
const User = require('../models/user')

/*courseRouter.get('/:id', async (req, res) => { // Commenting this out it might break something 
    try {
        const course = await Course.findById(req.params.id)
        .populate({
            path: 'reviews'
        })
        .populate('prerequisites', 'name number')
        .populate('instructors', 'name')
        if (course) {
            return res.status(401).json({error: 'Course not found'})
        } 
        res.status(200).json(course)
    } catch (err) {
        console.log('Course Fetch error', err)
        res.status(400).json({error: "1 bad request"})
    }
})*/

courseRouter.get('/', async (req, res) => {
    try {
        const courses = await Course.find()
        .populate({
            path: 'reviews'
        })
        .populate('instructors', 'name')
        // console.log("Courses found", courses)
        res.status(200).json(courses)
    } catch (error) {
        console.log("Error fetching courses", error)
        res.status(400).json({error: "2 bad request"})
    }
})

courseRouter.post('/', async (req,res) => {
    const course = new Course(req.body)
    
    try {
        const savedCourse = await course.save()
        res.status(201).json(savedCourse)
    } catch (error) {
        console.log(error)
        res.status(400).json({error: 'Invalid Course Data'})
    }
})

courseRouter.get('/:courseNumber', async (req,res) => {
    let num = req.params.courseNumber
    num = num.toUpperCase();
    num = num.replace(/([A-Z]+)([0-9]+)/, '$1 $2');
    //Number is now in form like such that cs180 -> CS 180
    try {
        const course = await Course.findOne({number: num}).populate({
            path: 'reviews',
            populate: {
                path: 'instructor',
                select: 'name'
            }
        })
        .populate('instructors', 'name')
        if (!course) {
            res.status(404).json({message: "Course Not Found"});
        }
        res.status(200).json(course)
    }
    catch( error ) {
        res.status(400).json({error: "Invalid Course Number"})
    }
})

// favorite a course
courseRouter.put('/favorite/:id', async (req,res) => {
    const { userId } = req.body;
    const courseId = req.params.id;
    console.log(userId)
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({error: "Course not found"})
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({error: "User not found"})
        }

        if (!user.favorited.includes(courseId)) {
            // favorite course
            await User.findByIdAndUpdate(userId, {$push: {favorited: courseId} });
            console.log("New Favorites: " + user.favorited);
        }
        else {
            // already favorited, unfavorited
            await User.findByIdAndUpdate(userId, {$pull: {favorited: courseId} });
            console.log("New Favorites: " + user.favorited);
        }

        return res.status(200).json({message: "Successfully Favorited"})
    } catch (err) {
        console.log(err)
        return res.status(401).json({error: "Bad Request" })
    }
})

// update prerequisites
courseRouter.put('/prerequisite/:id', async (req, res) => {
    const { newPrerequisites } = req.body
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, {prerequisites: newPrerequisites}, {new: true})
        res.status(200).json(course)
    }
    catch(e) {
        res.status(500).json({error: 'server error'})
    }
})

// courseRouter.post('/groupadd', async (req, res) => {
//     const courses = req.body
//     try {
//         for (const course of courses) {
//             const cleanedCourse = new Course({
//                 name: course.Title,
//                 number: course.Code,
//                 description: course.Description,
//                 instructors: [],
//                 difficulty: 0,
//                 enjoyment: 0,
//                 recommended: 0,
//                 reviews: [],
//                 prerequisites: [],
//                 creditHours: course.CreditHours,
//                 conflicts: []
//             })
//             await cleanedCourse.save()
//         }
//         res.status(201).json({})
//     }
//     catch(e) {
//         console.log('error occurred during group add of courses', e)
//         res.status(500).json({error: 'server error'})
//     }
// })

module.exports = courseRouter