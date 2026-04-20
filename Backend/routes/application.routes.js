import express from "express";
import { applyJob, getMyApplications } from "../controllers/application.controller.js";
import { updateApplicationStatus } from "../controllers/application.controller.js";
import { authorizeRoles } from "..//middlewares/role.middleware.js";
import { getAllApplications } from "../controllers/application.controller.js";
import { deleteApplication } from "../controllers/application.controller.js";
import {
  getRecruiterApplications,
  filterApplications,
  getDashboardStats
} from "../controllers/application.controller.js";
import { protect } from "..//middlewares/auth.middleware.js";

const router =express.Router();

router.post("/apply/:jobId", protect, applyJob);
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
router.get("/recruiter", protect, authorizeRoles("recruiter"), getRecruiterApplications);

router.get("/filter", protect, authorizeRoles("recruiter"), filterApplications);

router.get("/stats", protect, authorizeRoles("recruiter"), getDashboardStats);

export default router;