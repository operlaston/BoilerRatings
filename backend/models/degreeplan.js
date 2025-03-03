const mongoose = require("mongoose");

const degreePlanSchema = new mongoose.Schema({
    planID: Number,
    planName: String,
    requirements: [{
        name: {
            type: String,
            required: true
        },
        isCompleted: {
            type: Boolean,
            required: true
        } 
    }],
    totalCredits: Number,
    graduationSemester: {
        type: String,
        required: true,
        match: [
          /^(Fall|Spring|Summer|Winter)\s\d{4}$/,
          'Error: use format Season+Year Ex:"Fall 2023"',
        ],
      },
    savedCourses: [{
        semester: {
            type: String,
            required: true,
            match: [
              /^(Fall|Spring|Summer|Winter)\s\d{4}$/,
              'Error: use format Season+Year Ex:"Fall 2023"',
            ],
          },
        courses: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }]
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