const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  semesterTaken: {
    type: String,
    required: true,
    match: [
      /^(Fall|Spring|Summer|Winter)\s\d{4}$/,
      'Error: use format Season+Year Ex:"Fall 2023"',
    ],
  },
  reviewContent: {
    type: String,
    required: true,
    minlength: [20, "Review must be at least 20 characters"],
    maxlength: [500, "Review cannot exceed 500 characters"],
  },
  recommend: {
    type: Boolean,
    required: true,
  },
  difficulty: {
    type: Number,
    required: true,
    min: [1, "Difficulty must be between 1-5"],
    max: [5, "Difficulty must be between 1-5"],
  },
  enjoyment: {
    type: Number,
    required: true,
    min: [1, "Enjoyment must be between 1-5"],
    max: [5, "Enjoyment must be between 1-5"],
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor",
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  reports: [
    {
      reason: {
        type: String,
        required: true,
      },
      reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

reviewSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
