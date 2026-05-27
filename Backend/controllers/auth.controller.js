import User from "../models/user.js";

import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";

import jwt from "jsonwebtoken";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function signAuthToken(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function sanitizeUser(userDoc) {
  const user = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
  delete user.password;
  return user;
}


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

    // Account created through Google OAuth may not have password set
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Use Google Sign-In for this account"
      });
    }

    // CREATE TOKEN
    const token = signAuthToken(user);

    // SUCCESS
    return res.status(200).json({

      success: true,

      message: "Login successful",

      token,

      user: sanitizeUser(user)
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({

      success: false,

      error: err.message
    });
  }
};

// ================= GOOGLE AUTH =================
export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required"
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({
        success: false,
        message: "Google auth is not configured on server"
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      return res.status(400).json({
        success: false,
        message: "Unable to read Google profile"
      });
    }

    let user = await User.findOne({ email: payload.email });

    if (!user) {
      user = await User.create({
        name: payload.name || "Google User",
        email: payload.email,
        googleId: payload.sub,
        role: "jobseeker",
        isApproved: true,
        profilePhoto: payload.picture || ""
      });
    } else {
      // Keep user linked to Google for future logins
      if (!user.googleId) user.googleId = payload.sub;
      if (!user.profilePhoto && payload.picture) user.profilePhoto = payload.picture;
      await user.save();
    }

    if (user.role === "recruiter" && !user.isApproved) {
      return res.status(403).json({
        success: false,
        message: "Recruiter not approved by admin"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      token: signAuthToken(user),
      user: sanitizeUser(user)
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      message: "Google authentication failed"
    });
  }
};