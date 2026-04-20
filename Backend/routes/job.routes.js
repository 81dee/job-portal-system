import express from "express";
import { createJob, getJobs } from "../controllers/job.controller.js";
import { protect } from "..//middlewares/auth.middleware.js";
import { authorizeRoles } from "..//middlewares/role.middleware.js";

const router = express.Router();

// only recrutier can create job
router.post("/create", protect, authorizeRoles("recruiter"), createJob);

// anyone can viewjobs
router.get("/", getJobs);

export default router;