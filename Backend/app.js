import express from "express";

import { config } from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import userRoutes from "./routes/user.routes.js";
import { protect } from "./middlewares/auth.middleware.js";
import cors from "cors";

 

config();
connectDB();


const app = express();

// middleware
app.use(express.json());
app.use(cors());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/application", applicationRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API running...");
});

// protected route
app.get("/api/profile", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});

export default app;