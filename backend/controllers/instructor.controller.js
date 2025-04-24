const instructorRouter = require('express').Router()
const Instructor = require('../models/instructor')
const Course = require('../models/course');
const Review = require('../models/review');

instructorRouter.post('/', async (req, res) =>{
    const {name, gpa, rmp, rmpLink} = req.body;
    const instructor = new Instructor({
        name: name,
        gpa: gpa,
        rmp: rmp,
        rmpLink: rmpLink,
        courses: []
    })
    try {
        const savedInstructor = await instructor.save()
        res.status(201).json(savedInstructor)
    } catch (error) {
        res.status(400).json({error: 'Invalid Instructor Data'})
    }
})

instructorRouter.put('/:id/courses', async (req, res) => {
    const {courseId} = req.body
    try {
        const course = await Course.findById(courseId)
        const instructor = await Instructor.findById(req.params.id)
        if(!course) {
          res.status(404).json({ error: 'Course not found'})
        }

        if (course && instructor) {
            instructor.courses.push(courseId)
            await instructor.save()
            course.instructors.push(instructor._id)
            await course.save()
            res.json(course)
        } else {
            res.status(404).json({ error: 'Instructor not found'})
        }
    } catch (error) {
        res.status(400).json(error)
    }
})
instructorRouter.put('/:id/save', async (req, res) => {
  const {name, gpa, rmp, rmpLink, courses} = req.body
  try {
    const instructor = await Instructor.findById(req.params.id);
    instructor.name = name;
    instructor.gpa = gpa;
    instructor.rmp = rmp;
    instructor.rmpLink = rmpLink;
    for (let courseId of courses) {
      const course = await Course.findById(courseId);
      if (course && !course.instructors.includes(instructor._id)) {
        course.instructors.push(instructor._id);
        await course.save();
      }
    }
    for (let currentCourseId of instructor.courses) {
      if (!courses.includes(currentCourseId.toString())) {
        const course = await Course.findById(currentCourseId);
        if (course) {
          // Remove instructor from the course's instructors array
          course.instructors = course.instructors.filter(id => !id.equals(instructor._id));
          await course.save();
        }
      }
    }
    instructor.courses = courses;
    await instructor.save();
    res.status(200).json(instructor)
  } catch (error) {
    res.status(400).json(error)
    console.log("Error: ", error)
  }
})
// Remove instructor from all courses
instructorRouter.delete('/:id', async (req, res) => {
  try {
    const instructorId = req.params.id;

    // Optional: check if the instructor exists
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({ error: 'Instructor not found' });
    }

    // Remove the instructor from all courses
    await Course.updateMany(
      { instructors: instructorId },
      { $pull: { instructors: instructorId } }
    );

    // Delete the instructor
    await Instructor.findByIdAndDelete(instructorId);

    res.json({ message: 'Instructor deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


instructorRouter.patch('/:id/remove-from-courses', async (req, res) => {
  try {
    const instructorId = req.params.id;

    // Optional: check if the instructor exists
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({ error: 'Instructor not found' });
    }

    // Remove the instructor from all courses
    await Course.updateMany(
      { instructors: instructorId },
      { $pull: { instructors: instructorId } }
    );

    // Optional: clear the instructor's courses array too
    instructor.courses = [];
    await instructor.save();

    res.json({ message: 'Instructor removed from all courses.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
// Edit instructors and also update courses 
instructorRouter.patch('/:id/add-to-all-courses', async (req, res) => {
    const instructorId = req.params.id;
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const instructor = await Instructor.findById(instructorId).session(session);
      if (!instructor) {
        await session.abortTransaction();
        return res.status(404).json({ error: "Instructor not found" });
      }
  
      // Find all courses where this instructor is not listed
      const coursesToUpdate = await Course.find({
        instructors: { $ne: instructorId }
      }).session(session);
  
      for (const course of coursesToUpdate) {
        course.instructors.push(instructorId);
        await course.save({ session });
  
        if (!instructor.courses.includes(course._id)) {
          instructor.courses.push(course._id);
        }
      }
  
      await instructor.save({ session });
      await session.commitTransaction();
      res.json({ updatedCoursesCount: coursesToUpdate.length });
    } catch (err) {
      await session.abortTransaction();
      res.status(400).json({ error: err.message });
    } finally {
      session.endSession();
    }
  });

//Puts the instrucor id in every courses course array
//Probably dont use this in general use but for sprint 2 we need instructors in our courses so putting test instructor 1 and test instructor 2 in
instructorRouter.put('/:id', async (req, res) => {
    try {
    const instructorId = req.params.id;
    console.log(instructorId)
    const instructor = await Instructor.findById(instructorId)
    console.log(instructor)
    if (!instructor) {
        return res.status(404).json({message: "Instructor not found"})
    }
    await Course.updateMany({},
        {$push: {instructors: instructorId}}
    )
    res.status(200).json({message: "Instructo added successfullty"})
} catch (error) {
    res.status(400).json({error: error.message})
}
})

// calculate difficulty of instructor in a certain course
instructorRouter.put('/difficulty/course/:id', async (req, res) => {
  const profId = req.params.id;
  const { courseId } = req.body;
  //console.log(`{\n  profId: ${profId},\n  courseId: ${courseId}\n}`)
  try {
    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      return res.status(404).json({error: "Course not found"})
    }

    const profExists = await Instructor.findById(profId);
    if (!profExists) {
      return res.status(404).json({error: "Instructor not found"})
    }

    const included = courseExists.instructors.includes(profId)
    if (!included) {
      return res.status(400).json({ error: "Instructor not in course"})
    }

    var count = 0;
    var score = 0;
    for (const review of courseExists.reviews) {
      const r = await Review.findById(review)

      if (r?.instructor != profId)
        continue;

      score = score + r.difficulty
      count = count + 1
    }

    if (count > 0)
      score = score / count
    else
      score = -1

    return res.status(200).json(score)

  } catch (err) {
    console.log(err)
    return res.status(400).json({error: "Bad Request"})
  }
})
//Gets all the instructors from the db
instructorRouter.get('/', async (req, res) => {
  try {
    const instrucors = await Instructor.find({}).populate("courses")
    return res.status(201).json(instrucors)
  } catch (error) {
    return res.status(400).json({error: "Bad request"})
  }
})


module.exports = instructorRouter
