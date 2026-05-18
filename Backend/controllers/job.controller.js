import Job from "../models/job.js";
import Company from "../models/company.js";

// CREATE JOB
export const createJob = async (req, res) => {
  try {
    const { title, description, company } = req.body;

    const job = await Job.create({
      title,
      description,
      company,
      createdBy: req.user.id
    });

    res.json({
      message: "Job created",
      job
    });

  } catch (err) {
    res.json({ error: err.message });
  }

    const company = await Company.findOne({
    recruiter: req.user._id
    });

   if(!company){
   return res.status(404).json({
      success: false,
      message: "Company not found"
   });
  }

  if(company.approvalStatus !== "approved"){
   return res.status(403).json({
      success: false,
      message: "Company approval pending from admin"
   });
  }
};


// GET ALL JOBS
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();

    res.json(jobs);

  } catch (err) {
    res.json({ error: err.message });
  }
};

export const getRecruiterJobs = async (req, res) => {

    try {

        const jobs = await Job.find();

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