import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  resume: String,
  resumePublicID: String,

  role: {
    type: String,
    enum: ["jobseeker", "recruiter", "admin"],
    default: "jobseeker",
  },

  mobileNumber: {
     type: String
  },

  location: {
    city: String,
    state: String,
    country: String,
    pincode: String
  },

  socialLinks: {
     linkedin: String,
     github: String,
     portfolio: String
  },

  companyName: {
   type: String
  },

  isApproved: {
   type: Boolean,
   default: false
  },

  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job"
  }]

}, { timestamps: true });

export default mongoose.model("User", userSchema);