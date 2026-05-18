import mongoose from "mongoose";

const companySchema = new mongoose.Schema({

    companyName: {
        type: String,
        required: true,
    },

    companyEmail: {
        type: String,
        required: true,
    },

    mobileNumber: {
        type: String,
        required: true,
    },

    companyWebsite: String,

    companyLogo: String,

    companyDescription: String,

    industryType: {
        type: String,
        enum: [
            "Technology",
            "Finance",
            "Healthcare",
            "Education",
            "Marketing",
            "Government",
            "Design",
            "HR"
        ]
    },

    location: {
        city: String,
        state: String,
        country: String,
        pincode: String
    },

    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    approvalStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }

}, { timestamps: true });

const Company = mongoose.model("Company", companySchema);

export default Company;