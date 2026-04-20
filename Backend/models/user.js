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
  }

}, { timestamps: true });

export default mongoose.model("User", userSchema);