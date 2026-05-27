import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
  scheduleInterview,
  getRecruiterInterviews,
  getMyInterviews,
  updateInterviewStatus,
  getInterviewById,
} from "../controllers/interview.controller.js";

const router = express.Router();

router.post(
  "/schedule",
  protect,
  authorizeRoles("recruiter"),
  scheduleInterview
);

router.get(
  "/recruiter",
  protect,
  authorizeRoles("recruiter"),
  getRecruiterInterviews
);

router.get("/my", protect, authorizeRoles("jobseeker"), getMyInterviews);

router.get("/:id", protect, getInterviewById);

router.put(
  "/:id/status",
  protect,
  authorizeRoles("recruiter"),
  updateInterviewStatus
);

export default router;
