import jwt from "jsonwebtoken";

import User from "../models/user.js";


// ================= PROTECT =================

export const protect = async (req, res, next) => {

  try {

    const authHeader = req.headers.authorization;

    // CHECK TOKEN
    if (!authHeader) {

      return res.status(401).json({

        success: false,

        message: "No token provided"
      });
    }

    // GET TOKEN
    const token = authHeader.split(" ")[1];

    // VERIFY TOKEN
    const decoded = jwt.verify(

      token,

      process.env.JWT_SECRET
    );

    // FETCH LATEST USER FROM DATABASE
    const user = await User.findById(decoded.id).select("-password");

    // CHECK USER
    if (!user) {

      return res.status(404).json({

        success: false,

        message: "User not found"
      });
    }

    // ATTACH USER
    req.user = user;

    next();

  } catch (err) {

    console.log(err);

    return res.status(401).json({

      success: false,

      message: "Invalid token"
    });
  }
};