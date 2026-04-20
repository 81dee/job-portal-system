import Job from "../models/job.js";

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