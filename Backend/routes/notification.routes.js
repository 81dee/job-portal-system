import express from "express";

import Notification from "../models/notification.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// GET USER NOTIFICATIONS
router.get(

  "/my",

  protect,

  async (req, res) => {

    try {

      const notifications = await Notification.find({

        user: req.user.id
      })

      .sort({

        createdAt: -1
      });

      res.json(notifications);

    } catch (error) {

      res.status(500).json({

        error: error.message
      });
    }
  }
);

export default router;