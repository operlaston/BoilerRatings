const mongoose = require("mongoose");
const reviewRouter = require("express").Router();
const User = require("../models/user");
const Review = require("../models/review");
const Report = require("../models/report");
const Course = require("../models/course");

// Route to get all reviews
reviewRouter.get('/', async (req, res) => {
  try {
    const allReviews = await Review.find()
      .populate("user", "username email")
      .populate("course", "name number");
    return res.status(200).json(allReviews);
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    return res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

//This route just gets every report
reviewRouter.get('/reports', async(req,res) => {
  try {
    const reports = await Report.find({})
    .populate({
      path: "review",
      populate: {
        path: "user",
        select: "username" // only populate the name field of the user
      }
    });
    res.status(201).json(reports)
  } catch (error) {
    console.log(error)
    res.status(400).json({"error": "bad request"})
    
  }
})

reviewRouter.get("/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("instructor", "instructorName gpa")
      .populate("user", "username email")
      .populate("reports")
      .populate("course")
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(200).json(review);
  } catch (err) {
    console.log("Review Fetch error", err);
    res.status(400).json({ error: "Bad request" });
  }
});

reviewRouter.post("/", async (req, res) => {
  const { review, course, userId, instructorID } = req.body;
  // const user = review.user;

  console.log("review post controller trigger");
  try {
    const courseExists = await Course.findById(course);
    if (!courseExists) {
      return res.status(404).json({ error: "Course not found" });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ error: "User not found"});
    }

    const newReview = new Review({...review, course: courseExists._id, user: userExists});
    const savedReview = await newReview.save();
    if (
      typeof review.difficulty !== "number" ||
      typeof review.enjoyment !== "number"
    ) {
      return res
        .status(400)
        .json({ error: "Invalid difficulty/enjoyment values" });
    }
    if (!instructorID) {
      await Course.findByIdAndUpdate(course, {
       $push: { reviews: savedReview._id },
       $set: {
          difficulty:
            ((courseExists.difficulty * courseExists.reviews.length +
              review.difficulty) / (courseExists.reviews.length + 1)),
          enjoyment:
            ((courseExists.enjoyment * courseExists.reviews.length +
              review.enjoyment) / (courseExists.reviews.length + 1)),
          recommended:
            review.recommend === true //In review schema, its called recommend not recommended
              ? courseExists.recommended + 1
              : courseExists.recommended,
        },
      });
    } else {
      await Course.findByIdAndUpdate(course, {
        $push: { reviews: savedReview._id },
        $set: {
          difficulty:
            ((courseExists.difficulty * courseExists.reviews.length +
              review.difficulty) / (courseExists.reviews.length + 1)),
          enjoyment:
            ((courseExists.enjoyment * courseExists.reviews.length +
              review.enjoymeny) / (courseExists.reviews.length + 1)),
          recommend:
            review.recommend === true //In review schema, its called recommend not recommended
              ? courseExists.recommended + 1
              : courseExists.recommended,
         },
       });
    }
    /*if (instructor) {
      // was getting instructor not defined earlier
      await Instructor.findByIdAndUpdate(instructorID, {$addToSet: {courses: course}})
    }*/
    await User.findByIdAndUpdate(userId, { $push: { reviews: savedReview._id } });

    res.status(201).json(savedReview);
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(400).json({ error: "Bad request" });
  }
});

// Edit review
reviewRouter.put("/:id", async (req, res) => {
  try {
    console.log("review edit controller trigger");
    const { id } = req.params;
    const newReviewData = req.body.updatedReview;

    // Validate id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid review ID format" });
    }

    // Find existing review
    const existingReview = await Review.findById(id);
    if (!existingReview) {
      return res.status(404).json({ error: "Review not found" });
    }


    // Update review
    console.log("passed newreviewdata");
    console.log(newReviewData);
    const updatedReview = await Review.findOneAndUpdate(
      { _id: id },
      newReviewData,
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ error: "Review not found" });
    }
    console.log("this is updated Review:")
    console.log(updatedReview)


    // Recalculate course aggregates
    /*
    const course = await Course.findOne({ reviews: id }).populate("reviews");

    const reviews = course.reviews;
    const numReviews = reviews.length;

    const newDifficulty =
      reviews.reduce((sum, r) => sum + r.difficulty, 0) / numReviews;
    const newEnjoyment =
      reviews.reduce((sum, r) => sum + r.enjoyment, 0) / numReviews;
    const newRecommended = reviews.filter((r) => r.recommend).length;

    console.log(newDifficulty);
    console.log(newEnjoyment);
    console.log(newRecommended);


    await Course.findByIdAndUpdate(course._id, {
      difficulty: Math.round(newDifficulty * 10) / 10,
      enjoyment: Math.round(newEnjoyment * 10) / 10,
      recommended: newRecommended,
    });
    */

    res.status(200).json(updatedReview);
  } catch (err) {
    console.error("Error updating review:", err);

    // Handle validation errors
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }

    // Handle cast errors
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Malformed request data" });
    }

    res.status(500).json({ error: "Server error" });
  }
});

reviewRouter.get("/course", async (req, res) => {
  const cID = req.body;
  console.log(cID);
  try {
    const courseFound = await Course.findById(cID).populate({
      path: "reviews",
      populate: [{
        path: "user",
        select: "username email",
      },
      {
        path: "instructor",
        select: "name"
      },
    ]
    });
    const reviews = courseFound.reviews;
    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error adding review", error);
    res.status(400).json({ error: "Bad Request" });
  }
});
//Deletes a report
reviewRouter.delete('/reports/:id', async (req, res) => {
  try {
    const reportId = req.params.id;

    // Find the report
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Mark the report as resolved
    report.isResolved = true;
    await report.save();

    const reviewId = report.review;

    if (reviewId) {
      const review = await Review.findById(reviewId).populate('reports');
      if (review) {
        // Remove this report's ID from the review's reports array
        review.reports = review.reports
          .filter(r => !r._id.equals(reportId))
          .map(r => r._id); // ensure we keep only IDs in the array

        // Count how many unresolved reports are left
        const unresolvedReports = review.reports.filter(r => !r.isResolved);

        // If fewer than 3 unresolved reports, unhide the review
        if (unresolvedReports.length < 3) {
          review.hidden = false;
        }

        // If no unresolved reports, mark the review as resolved
        if (unresolvedReports.length === 0) {
          review.isResolved = true;
        }

        await review.save();
      }
    }

    res.status(200).json("Report marked as resolved and review updated");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
})
// delete a review
// client should send a review_id
reviewRouter.delete("/:id", async (req, res) => {
  const reviewID = req.params.id;
  try {
    const r = await Review.findById(reviewID);
    if (r === null) {
      res.status(401).json({ error: "review not found" });
      return;
    }
    //need to remove r from the course and from the user
    await User.findByIdAndUpdate(r.user, {
      $pull: {reviews: r.id}
    })
    await Course.findByIdAndUpdate(r.course, {
      $pull: {reviews: r.id}
    })
    await Review.findByIdAndDelete(r.id);
    res.status(200).json({ message: "review successfully deleted" });
    return;
  } catch (err) {
    res.status(400).json({ error: "bad request" });
    return;
  }
});

reviewRouter.put('/like/:id', async (req, res) => {
  const { userId } = req.body;
  const reviewId = req.params.id;
  const reviewObjectId = new mongoose.Types.ObjectId(reviewId);
  try {
    const user = await User.findById(userId)
      .populate('likedReviews.review')
    // console.log(user)
    // const review = await Review.findById(reviewId)
    const likedReviews = user.likedReviews
    // if the review is in the user's likedReviews list
    console.log(likedReviews)
    let likedReview = null
    for (let i = 0; i < likedReviews.length; i++) {
      const currReview = likedReviews[i];
      if (currReview.review === null) {
        await User.findByIdAndUpdate(userId,
          {$pull: {likedReviews: {_id: currReview._id}}})
      }
      else if (currReview.review._id.toString() === reviewId) {
        likedReview = currReview
      }
    }

    if (likedReview) {
      // if it is a like
      if (likedReview.favorability === 1) {
        const newReview = await Review.findByIdAndUpdate(reviewId, {$inc: {likes: -1}}, {new: true})
        const newUser = await User.findByIdAndUpdate(userId,
          {$pull: {likedReviews: {review: reviewObjectId}}},
          {new: true})
        return res.status(200).json({newUser, newReview})
      }
      // if it is a dislike
      else {
        const newReview = await Review.findByIdAndUpdate(reviewId, {$inc: {likes: 2}}, {new: true})
        const newUser = await User.findOneAndUpdate(
          { _id: userId, 'likedReviews.review': reviewObjectId },
          { $set: { 'likedReviews.$.favorability': 1 } },
          {new: true})
        return res.status(200).json({newUser, newReview})
      }
    }
    const newReview = await Review.findByIdAndUpdate(reviewId, {$inc: {likes: 1}}, {new: true})
    const newLikedReviewObject = {
      favorability: 1,
      review: reviewObjectId
    }
    const newUser = await User.findByIdAndUpdate(userId,
      { $addToSet: { likedReviews: newLikedReviewObject } },
      {new: true})
    res.status(200).json({newUser, newReview})
  }
  catch (err) {
    console.log(err)
    res.status(500).json({"error": "bad request"})
  }
})

reviewRouter.put('/dislike/:id', async (req, res) => {
  const { userId } = req.body;
  const reviewId = req.params.id;
  const reviewObjectId = new mongoose.Types.ObjectId(reviewId);
  try {
    const user = await User.findById(userId)
      .populate('likedReviews.review')
    // console.log(user)
    // const review = await Review.findById(reviewId)
    const likedReviews = user.likedReviews
    // if the review is in the user's likedReviews list
    const likedReview = likedReviews.find(likedReview => likedReview.review._id.toString() === reviewId)
    if (likedReview) {
      // if it is a like
      if (likedReview.favorability === 1) {
        const newReview = await Review.findByIdAndUpdate(reviewId, {$inc: {likes: -2}}, {new: true})
        const newUser = await User.findOneAndUpdate(
          { _id: userId, 'likedReviews.review': reviewObjectId },
          { $set: { 'likedReviews.$.favorability': -1 } },
          {new: true})
        return res.status(200).json({newUser, newReview})
      }
      // if it is a dislike
      else {
        const newReview = await Review.findByIdAndUpdate(reviewId, {$inc: {likes: 1}}, {new: true})
        const newUser = await User.findByIdAndUpdate(userId,
          {$pull: {likedReviews: {review: reviewObjectId}}},
          {new: true})
        return res.status(200).json({newUser, newReview})
      }
    }
    const newReview = await Review.findByIdAndUpdate(reviewId, {$inc: {likes: -1}}, {new: true})
    const newDislikedReviewObject = {
      favorability: -1,
      review: reviewObjectId
    }
    const newUser = await User.findByIdAndUpdate(userId,
      { $addToSet: { likedReviews: newDislikedReviewObject } },
      {new: true})
    res.status(200).json({newUser, newReview})
  }
  catch (err) {
    res.status(400).json({"error": "bad request"})
  }
})

// report a review
// client should send string of report content
reviewRouter.put('/report/:id', async(req, res) => {
    const { reportString, reportReason } = req.body
    const reviewID = req.params.id


    try {
        // find review
        var review = await Review.findById(reviewID)
        if (review == null) {
            return res.status(401).json({ "error": "review not found" })
        }
        if (reportString == null) {
            return res.status(401).json({ "error": "null report string" })
        }
        if (reportReason == null) {
          return res.status(401).json({ "error": "null Reason string" })
      }

        const report = new Report({
            content: reportString,
            reason: reportReason,
            review: reviewID,
            isResolved: false
        });

        const savedReport = await report.save()
        await Review.findByIdAndUpdate(reviewID, { $push: { reports: savedReport._id } })

        review = await Review.findById(reviewID)
        // review should be hidden
        if (review.reports.length >= 3) {
            await Review.findByIdAndUpdate(reviewID, { $set: { hidden: true } });
        }

        return res.status(200).json({ "message": "report created successfully" })
    }
    catch (err) {
        return res.status(400).json({ "error": "bad request" })
    }
})


module.exports = reviewRouter