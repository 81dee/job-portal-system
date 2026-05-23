import express from "express";
import { uploadResume } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import resumeUpload from "../middlewares/resumeUpload.middleware.js";
import { deleteResume } from "../controllers/user.controller.js";
import upload from "../middlewares/profileUpload.middleware.js";
import { updateProfile } from "../controllers/user.controller.js";
const router = express.Router();

router.post("/upload-resume", protect, resumeUpload.single("resume"), uploadResume);

router.delete("/delete-resume", protect, deleteResume);

router.put("/profile", protect, upload.single("profilePhoto"), updateProfile);
export default router;