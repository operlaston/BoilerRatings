const reviewRouter = require("express").Router();
const User = require("../models/user");
const Review = require("../models/review");
const Course = require("../models/course");
const mongoose = require('mongoose')

reviewRouter.get("/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("instrutor", "instructorName gpa")
      .populate("user", "username email")
      .populate("reports");
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
  const { review, course } = req.body;
  const user = review.user;

  console.log("review post controller trigger");
  try {
    const courseExists = await Course.findById(course);
    if (!courseExists) {
      return res.status(401).json({ error: "Course not found" });
    }
    const newReview = new Review(review);
    const savedReview = await newReview.save();
    if (
      typeof review.difficulty !== "number" ||
      typeof review.enjoyment !== "number"
    ) {
      return res
        .status(400)
        .json({ error: "Invalid difficulty/enjoyment values" });
    }

    await Course.findByIdAndUpdate(course, {
      $push: { reviews: savedReview._id },
      $inc: { numReviews: 1 },
      $set: {
        difficulty:
          Math.round(
            ((courseExists.difficulty * courseExists.numReviews +
              review.difficulty) /
              (courseExists.numReviews + 1)) *
              10
          ) / 10,
        enjoyment:
          Math.round(
            ((courseExists.enjoyment * courseExists.numReviews +
              review.enjoyment) /
              (courseExists.numReviews + 1)) *
              10
          ) / 10,
        recommended:
          review.recommended === true
            ? courseExists.recommended + 1
            : courseExists.recommended,
      },
    });
    await User.findByIdAndUpdate(user, { $push: { reviews: savedReview._id } });

    res.status(201).json(savedReview);
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(400).json({ error: "Bad request" });
  }
});

reviewRouter.get('/course', async(req, res) => {
    const cID = req.body
    console.log(cID)
    try {
        const courseFound = await Course.findById(cID)
        .populate({
            path: 'reviews',
            populate: {
                path: 'user',
                select: 'username email'
            }
        })
        const reviews = courseFound.reviews
        res.status(200).json({reviews})
    } catch (error) {
        console.error('Error adding review', error)
        res.status(400).json({error: 'Bad Request'})
    }
})


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
reviewRouter.delete('/:id', async (req, res) => {
    const reviewID = req.params.id
    try {
        const r = await Review.findById(reviewID)
        if (r === null) {
            res.status(401).json({ "error": "review not found" })
            return
        }
        await Review.findOneAndDelete(r);
        res.status(200).json({ message: "review successfully deleted" })
        return
    }
    catch (err) {
        res.status(400).json({ "error": "bad request" })
        return
    }
})

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
    const likedReview = likedReviews.find(likedReview => likedReview.review._id.toString() === reviewId)
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
    res.status(400).json({"error": "bad request"})
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

module.exports = reviewRouter