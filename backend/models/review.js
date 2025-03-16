const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date: Date,
  semesterTaken: String,
  reviewContent: String,
  recommend: Boolean,
  anon: Boolean,
  difficulty: Number,
  enjoyment: Number,
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor",
  },
  likes: Number,
  reports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    },
    ],
  hidden: {
      type: Boolean,
      default: false
  }
});

reviewSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    if (!returnedObject._id) return;
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
