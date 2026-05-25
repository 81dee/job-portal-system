import express from "express";
import User from "../models/user.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
  getPendingRecruiters,
  approveRecruiter
} from "../controllers/admin.controller.js";

const router = express.Router();

//only admin
router.get("/users", protect, authorizeRoles("admin"), async (req, res) => {
   const users = await User.find();
   res.json(users);
});

router.get("/pending-recruiters", getPendingRecruiters);

router.put("/approve/:id", approveRecruiter);


export default router;