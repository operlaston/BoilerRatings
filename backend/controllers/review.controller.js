const mongoose = require("mongoose"); // Add this line at the top
const reviewRouter = require("express").Router();
const User = require("../models/user");
const Review = require("../models/review");
const Report = require("../models/report");
const Course = require("../models/course");

reviewRouter.get("/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("instructor", "instructorName gpa")
      .populate("user", "username email")
      .populate("reports")
      .populate("course")
    if (!review) {
      return res.status(401).json({ error: "Review not found" });
    }
    res.status(200).json(review);
  } catch (err) {
    console.log("Review Fetch error", err);
    res.status(400).json({ error: "Bad request" });
  }
});

reviewRouter.post("/", async (req, res) => {
  const { review, course, userId, instructor } = req.body; 
  // const user = review.user;
  const instructorID = null;
  if (instructor) {
    instructorID = instructor.id;
  }
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
        //  difficulty:
        //    Math.round(
        //      ((courseExists.difficulty * courseExists.numReviews +
        //        review.difficulty) /
        //         (courseExists.numReviews + 1)) *
        //         10
        //    ) / 10,
        //  enjoyment:
        //    Math.round(
        //      ((courseExists.enjoyment * courseExists.numReviews +
        //        review.enjoyment) /
        //        (courseExists.numReviews + 1)) *
        //        10
        //    ) / 10,
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
         $addToSet: {instructors: instructorID},
       });
    }
    if (instructor) {
      // was getting instructor not defined earlier
      await Instructor.findByIdAndUpdate(instructorID, {$addToSet: {courses: course}})
    }
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

// client should send a string [OLD_REVIEW_ID]||[NEW_REVIEW]
// NOTE: use JSON.stringify(review) to convert the new review to a string
// exports.editReview = async (req, res) => {
//     var data = req.body
//     try {
//         data = data.split("||")
//         const oldReviewid = data[0]
//         const newData = JSON.parse(data[1])
//         if (newData === null) {
//             res.status(400).json({ "error": "bad request" })
//             return
//         }
//         const newReview = new Review(newData)
//         review = await Review.findById(oldReviewid)
//         if (review === null) {
//             res.status(401).json({ "error": "review not found" })
//             return
//         }
//         newReview._id = oldReviewid
//         await Review.findOneAndReplace(review, newReview)
//         res.status(200).json({ "message": "review successfully edited" })
//         return
//     }
//     catch (err) {
//         res.status(400).json({ "error": "bad request" })
//         return
//     }
// }

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
    await Review.findOneAndDelete(r);
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

// like a review
// client should send an object {userId}
// reviewRouter.put("/like/:id", async (req, res) => {
//   const { userId } = req.body;
//   const reviewId = req.params.id;
//   try {
//     if (reviewId === null) {
//       res.status(400).json({ error: "bad request" });
//       return;
//     }
//     const review = await Review.findById(reviewId);
//     if (!review) {
//       return res.status(401).json({ error: "review not found" });
//     }
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(401).json({ error: "user not found" });
//     }
//     // check if user has already interacted with this review
//     const includesReview = user.likedReviews.find(
//       (likedReview) => likedReview.review._id.toString() == review._id
//     );
//     if (includesReview) {
//       if (includesReview.favorability == 1) {
//         // user has already liked review
//         // remove like from user list and decrement like count by one
//         await User.findByIdAndUpdate(userId, {
//           $pull: { likedReviews: { review: review._id } },
//         });
//         await Review.findByIdAndUpdate(review, { $inc: { likes: -1 } });
//       } else {
//         // user has already disliked review
//         // change dislike to like and increment like count by 2 (net -1 to +1 likes)
//         await User.findByIdAndUpdate(
//           user,
//           { likedReviews: includesReview },
//           { $set: { "likedReviews.$.favorability": 1 } }
//         );
//         await Review.findByIdAndUpdate(review, { $inc: { likes: 2 } });
//       }
//     } else {
//       // user hasn't interacted with review
//       await User.findByIdAndUpdate(user, {
//         $push: { likedReviews: { review: review, favorability: 1 } },
//       });
//       await Review.findByIdAndUpdate(review, { $inc: { likes: 1 } });
//     }

//     return res.status(200).json({ message: "review changed successfully" });
//   } catch (err) {
//     console.log(err)
//     return res.status(500).json({ error: "server error" });
//   }
// });

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