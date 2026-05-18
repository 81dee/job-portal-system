import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },

   salaryPackage: {
     min: Number,
     max: Number,
    currency: {
      type: String,
      default: "INR"
    }
  },

  location: {
    city: String,
    state: String,
    country: String
  },

  workMode: {
    type: String,
    enum: ["Remote", "Hybrid", "Onsite"]
  },

  vacancies: {
    type: Number,
    default: 1
  },

   applicationsCount: {
     type: Number,
     default: 0
  },

  views: {
    type: Number,
    default: 0
  },

  featuredJob: {
    type: Boolean,
    default: false
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);