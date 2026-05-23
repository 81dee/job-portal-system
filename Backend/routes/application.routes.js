import express from "express";
import { applyJob, getMyApplications } from "../controllers/application.controller.js";
import { updateApplicationStatus } from "../controllers/application.controller.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { getAllApplications } from "../controllers/application.controller.js";
import { deleteApplication } from "../controllers/application.controller.js";
import {
  getRecruiterApplications,
  filterApplications,
  getDashboardStats
} from "../controllers/application.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/resumeUpload.middleware.js";
import { getJobseekerStats } from "../controllers/application.controller.js";

const router =express.Router();

router.post("/apply/:jobId", protect, upload.single("resume"),
 applyJob);
router.get("/my", protect, getMyApplications);
router.get("/", getAllApplications);
router.delete("/delete/:applicationId", protect, deleteApplication);

// recruiter only
router.put(
  "/status/:applicationId",
  protect,
  authorizeRoles("recruiter"),
  updateApplicationStatus
);

// all recruiter dashboard routes
router.get("/recruiter", protect, authorizeRoles("recruiter"),   async (req, res, next) => {

    console.log("REQ USER:", req.user);

    next();
  }, getRecruiterApplications);

router.get("/filter", protect, authorizeRoles("recruiter"), filterApplications);

router.get("/stats", protect, authorizeRoles("recruiter"), getDashboardStats);

router.get( "/jobseeker-stats", protect, getJobseekerStats);

export default router;