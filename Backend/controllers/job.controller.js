import Job from "../models/job.js";
import Company from "../models/company.js";
import User from "../models/user.js";

// CREATE JOB
export const createJob = async (req, res) => {

    try {

        const {
            title,
            description,
            category,
            workMode,
            companyName,
            salary,
            location
        } = req.body;

        const recruiter = await User.findById(req.user.id);

          if (

           recruiter.role === "recruiter" &&

           !recruiter.isApproved

        ) {

          return res.status(403).json({

            success: false,

              message: "Recruiter not approved by admin"
           });
       }

        const newJob = await Job.create({

            title,
            description,
            category,
            workMode,
            companyName,
            salary,
            location,

            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            message: "Job Created Successfully",
            newJob
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET ALL JOBS
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
    .populate(

        "createdBy",

        "name email companyName"
    );

    res.json(jobs);

  } catch (err) {
    res.json({ error: err.message });
  }
};

export const getRecruiterJobs = async (req, res) => {

    try {

        const jobs = await Job.find({
            createdBy: req.user.id
        });

        res.status(200).json(jobs);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteJob = async (req, res) => {

    try {

        await Job.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Job deleted"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateJob = async (req, res) => {

    try {

        const updatedJob = await Job.findByIdAndUpdate(

            req.params.id,

            req.body,

            { new: true }

        );

        res.status(200).json({
            success: true,
            updatedJob
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};