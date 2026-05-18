import express from "express";
import adminMiddleware from "../middlewares/admin.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

import recruiterMiddleware from "../middlewares/recruiter.middleware.js";
import {
   registerCompany,
   approveCompany
} from "../controllers/company.controller.js";

const router = express.Router();

router.post("/register", protect, recruiterMiddleware, registerCompany);

router.put("/approve/:id", protect, adminMiddleware, approveCompany);

export default router;