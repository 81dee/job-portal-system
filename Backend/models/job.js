import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    companyName: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true,

        enum: [
            "Technology",
            "Finance",
            "Healthcare",
            "Marketing",
            "Education",
            "Design",
            "Cyber Security"
        ]
    },

    workMode: {
        type: String,

        enum: [
            "Remote",
            "Hybrid",
            "Onsite"
        ]
    },

    salary: {
        type: String
    },

    location: {
        type: String,
        default: "India"
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true });

const Job = mongoose.model("Job", jobSchema);

export default Job;