const mongoose = require("mongoose");

const degreePlanSchema = new mongoose.Schema({
    userID: String,
    planName: String,
    requirements: [{
        name: {
            type: String,
            required: false //Setting this to false for now in sprint 2 or 3 when we flesh this out more we can re enable this
        },
        isCompleted: {
            type: Boolean,
            required: false //Setting this to false for now in sprint 2 or 3 when we flesh this out more we can re enable this
        } 
    }],
    totalCredits: Number,
    graduationSemester: {
        type: String,
        required: false, //Setting this to false for now in sprint 2 or 3 when we flesh this out more we can re enable this
        match: [
          /^(Fall|Spring|Summer|Winter)\s\d{4}$/,
          'Error: use format Season+Year Ex:"Fall 2023"',
        ],
      },

    savedCourses: [{
      courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      },
      semester: String,
      semesterIndex: Number,
    }]
})

degreePlanSchema.set("toJSON", {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    },
});

const DegreePlan = mongoose.model("DegreePlan", degreePlanSchema);
module.exports = DegreePlan;