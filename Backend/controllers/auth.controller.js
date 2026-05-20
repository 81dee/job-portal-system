import User from "../models/user.js";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";


// ================= REGISTER =================

export const registerUser = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      role,
      companyName
    } = req.body;

    // CHECK USER
    const exists = await User.findOne({ email });

    if (exists) {

      return res.status(400).json({

        success: false,

        message: "User already exists"
      });
    }

    // HASH PASSWORD
    const hashed = await bcrypt.hash(password, 10);

    // CREATE USER
    const user = await User.create({

      name,

      email,

      password: hashed,

      role: role || "jobseeker",

      companyName: companyName || "",

      // AUTO APPROVE
      isApproved:
        role === "jobseeker" ||
        role === "admin"
    });

    return res.status(201).json({

      success: true,

      message: "User registered successfully",

      user
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({

      success: false,

      error: err.message
    });
  }
};


// ================= LOGIN =================

export const loginUser = async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    // FIND USER
    const user = await User.findOne({ email });

    if (!user) {

      return res.status(400).json({

        success: false,

        message: "Invalid email or password"
      });
    }

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(

      password,

      user.password
    );

    if (!isMatch) {

      return res.status(400).json({

        success: false,

        message: "Invalid email or password"
      });
    }

    // RECRUITER APPROVAL CHECK
    if (
      user.role === "recruiter" &&
      !user.isApproved
    ) {

      return res.status(403).json({

        success: false,

        message: "Recruiter not approved by admin"
      });
    }

    // CREATE TOKEN
    const token = jwt.sign(

      {
        id: user._id,
        role: user.role
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d"
      }
    );

    // SUCCESS
    return res.status(200).json({

      success: true,

      message: "Login successful",

      token,

      user
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({

      success: false,

      error: err.message
    });
  }
};