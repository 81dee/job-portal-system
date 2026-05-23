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

    companyLogo: String,

    // CATEGORY
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

            "Cyber Security",

            "AI/ML",

            "Data Science",

            "Law"
        ]
    },

    // INDUSTRY
    industry: {
        type: String,

        default: "General"
    },

    // REQUIRED EDUCATION
    education: {
        type: String,

        default: "Any Graduate"
    },

    // SKILLS REQUIRED
    skillsRequired: [

        {
            type: String
        }
    ],

    // EXPERIENCE
    experienceRequired: {
        type: String,

        default: "Fresher"
    },

    // JOB TYPE
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

    // JOB STATUS
    status: {
        type: String,

        enum: [

            "Open",

            "Closed"
        ],

        default: "Open"
    },

    // TOTAL APPLICATIONS
    totalApplicants: {
        type: Number,

        default: 0
    },

    // RECRUITER
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,

        ref: "User"
    }

}, { timestamps: true });

const Job = mongoose.model(

    "Job",

    jobSchema
);

export default Job;