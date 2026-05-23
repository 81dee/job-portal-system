import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(

  {

    // JOB
    job: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "Job",

      required: true
    },

    // USER
    user: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true
    },

    // STATUS
    status: {

      type: String,

      enum: [

        "pending",

        "accepted",

        "rejected"
      ],

      default: "pending"
    },

    // EXTRA DETAILS
    fullName: String,

    email: String,

    phone: String,

    qualification: String,

    experience: String,

    skills: String,

    resume: String,

    message: String,

    interviewDate: String,

    interviewLink: String

  },

  {

    timestamps: true
  }
);

export default mongoose.model(

  "Application",

  applicationSchema
);