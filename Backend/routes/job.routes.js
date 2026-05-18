import express from "express";
import { createJob, getRecruiterJobs, deleteJob, getJobs, updateJob } from "../controllers/job.controller.js";
import { protect } from "..//middlewares/auth.middleware.js";
import { authorizeRoles } from "..//middlewares/role.middleware.js";

const router = express.Router();

// only recrutier can create job
router.post("/create", protect, authorizeRoles("recruiter"), createJob);

// anyone can viewjobs
router.get("/", getJobs);

router.put("/update/:id", updateJob);

router.get("/recruiter-jobs", getRecruiterJobs);

router.delete("/delete/:id", deleteJob);

export default router;