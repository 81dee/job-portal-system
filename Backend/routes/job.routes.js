import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createJob,
  getJobs,
  deleteJob,
  updateJob,
  getRecruiterJobs
} from "../controllers/job.controller.js";

const router = express.Router();

// CREATE JOB
router.post("/create", protect, createJob);

// GET ALL JOBS
router.get("/", getJobs);

// GET RECRUITER JOBS
router.get("/recruiter-jobs", protect, getRecruiterJobs);

// UPDATE JOB
router.put("/update/:id", updateJob);

// DELETE JOB
router.delete("/delete/:id", deleteJob);

export default router;