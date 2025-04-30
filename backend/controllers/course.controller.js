const courseRouter = require('express').Router()
const Course = require('../models/course')
const User = require('../models/user')
const DegreePlan = require('../models/degreeplan')
const Instructor = require('../models/instructor')
const pageReport = require('../models/pagereport')
const Requirement = require('../models/requirement')
const Review = require('../models/review')
const mongoose = require('mongoose')

courseRouter.get('/byid/:id', async (req, res) => { // Commenting this out it might break something 
    try {
        const course = await Course.findById(req.params.id)
        .populate({
            path: 'reviews'
        })
        .populate('prerequisites', 'name number')
        .populate('instructors', 'name')
        if (!course) {
            return res.status(404).json({error: 'Course not found'})
        } 
        res.status(200).json(course)
    } catch (err) {
        console.log('Course Fetch error', err)
        res.status(400).json({error: "1 bad request"})
    }
})

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

courseRouter.post('/', async (req, res) => {
    try {
        const { number, name, description, creditHours, prerequisites } = req.body;

        const formattedNumber = number
            .toUpperCase()
            .replace(/([A-Z]+)(\d+)/, "$1 $2")
            .replace(/\s+/g, ' ');

        // Check for existing course
        const existingCourse = await Course.findOne({ number: formattedNumber });
        if (existingCourse) {
            return res.status(409).json({ error: 'Course already exists' });
        }

        // Process prerequisites
        const prerequisiteIds = [];
        if (prerequisites && prerequisites.length > 0) {
            for (const prereq of prerequisites) {
                const formattedPrereq = prereq
                    .toUpperCase()
                    .replace(/([A-Z]+)(\d+)/, "$1 $2")
                    .replace(/\s+/g, ' ');
                
                const foundCourse = await Course.findOne({ number: formattedPrereq });
                if (foundCourse) prerequisiteIds.push(foundCourse._id);
            }
        }

        // Create new course
        const newCourse = new Course({
            number: formattedNumber,
            name: name.trim(),
            description: description.trim(),
            creditHours: creditHours || 3,
            prerequisites: prerequisiteIds,
            instructors: [] // Temporarily empty
        });

        const savedCourse = await newCourse.save();
        res.status(201).json(savedCourse);

    } catch (error) {
        console.error('Course creation error:', error);
        res.status(400).json({ 
            error: 'Invalid course data',
            details: error.message 
        });
    }
});

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

courseRouter.put('/date/:id', async(req,res) => {
    const courseId = req.params.id
    const { newDate } = req.body;
    try {
        const courseExists = await Course.findById(courseId)
        if (!courseExists) {
            return res.status(404).json({error: "Course not found"})
        }

        const year = newDate.substring(0,4)
        const month = newDate.substring(5,7)
        const day = newDate.substring(8,10)
        const date = new Date(year, month - 1, day).toISOString();

        console.log(month + " " + day + " " + year)
        await Course.findByIdAndUpdate(courseId, {$set : {timeToReview: date}})
        return res.status(200).json({message: "date updated successfully"})
    }
    catch (err) {
        return res.status(401).json({error: "bad request"})
    }
})

// test route to set all review dates to yesterday
courseRouter.put('/test/date/setall', async (req, res) => {
    console.log('changing all dates...')
    try {
        const date = new Date(Date.now() - (1000 * 60 * 60 * 24))
        console.log(`Setting all course dates to ${date.toDateString()}...`)
        await Course.updateMany({}, {$set: {timeToReview: date}})
        return res.status(200)
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({error: "server error"})
    }
})

courseRouter.put('/:id', async (req, res) => {
    try {
      console.log("Incoming update for:", req.params.id);
      console.log("Update data:", req.body);
  
      const courseId = req.params.id;
      const updates = req.body;
  
      // Validate required fields
      if (!updates.name || !updates.number) {
        console.log("Validation failed - missing name/number");
        return res.status(400).json({ error: 'Course name and number are required' });
      }
  
      // Convert instructor names to IDs
      if (updates.instructors && Array.isArray(updates.instructors)) {
        console.log("Processing instructors:", updates.instructors);
        updates.instructors = await Promise.all(
          updates.instructors.map(async (instructor) => {
            if (mongoose.Types.ObjectId.isValid(instructor)) {
              console.log("Existing instructor ID:", instructor);
              return instructor;
            }
            console.log("Looking up instructor:", instructor);
            let inst = await Instructor.findOne({ name: instructor });
            if (!inst) {
              console.log("Creating new instructor:", instructor);
              inst = new Instructor({ name: instructor });
              await inst.save();
            }
            return inst._id;
          })
        );
        console.log("Converted instructors:", updates.instructors);
      }
  
      const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        updates,
        { new: true, runValidators: true }
      )
      .populate('instructors', 'name')
      .populate('prerequisites', 'name number');
  
      if (!updatedCourse) {
        console.log("Course not found with ID:", courseId);
        return res.status(404).json({ error: 'Course not found' });
      }
  
      console.log("Successfully updated course:", updatedCourse);
      res.status(200).json(updatedCourse);
    } catch (err) {
      console.error('Update error:', err);
      res.status(500).json({ 
        error: 'Failed to update course',
        details: err.message 
      });
    }
});

// delete a course
courseRouter.delete('/:id', async(req, res) => {
    // needs to delete the course and all references of it which are in the following objects:
    // degreeplans/savedCourses/index/_id, 
    // instructors/courses/index, 
    // pagereports/page/(string/course number) *I CHANGED MY MIND I'M NOT DELETING THESE BC THEY ARE REPORTS, 
    // requirements/subrequirements/index/courses/index/(string/course number), 
    // reviews/course

    // delete from all degree plans
    try {
        const course = await Course.findById(req.params.id)
        if (course === null) {
            return res.status(404).json({error: 'course not found'})
        }
        await DegreePlan.updateMany(
            {"savedCourses.course": course._id}, 
            {$pull: {"savedCourses": {"course": course._id}}}
        )
        await Instructor.updateMany({ 
            "courses": {
                $elemMatch: {$eq: course._id}
            },
        }, {$pull: {"courses": course._id}})
        await Requirement.updateMany({
                "subrequirements.courses": course.number
            },
            { $pull: { "subrequirements.$[].courses": course.number } }
        )
        await Review.deleteMany({ "course": course._id })
        await Course.findByIdAndDelete(req.params.id)
        res.status(204).end()
    }
    catch(e) {
        console.error(e)
        res.status(500).json({error: 'server error'})
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
                return res.status(404).json({message: "Course Not Found"});
            }
            res.status(200).json(course)
        }
        catch( error ) {
            res.status(400).json({error: "Invalid Course Number"})
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