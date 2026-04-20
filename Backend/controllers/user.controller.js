import cloudinary from "../config/cloudinary.js";
import User from "../models/user.js";

// UPLOAD RESUME
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ message: "No file uploaded" });
    }

    // upload to cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      async (error, result) => {
        if (error) {
          return res.json({ error: error.message });
        }

        // save URL in DB
        const user = await User.findByIdAndUpdate(
          req.user.id,
          { 
            resume: result.secure_url,
            resumePublicId: result.public_id
           },
          { new: true }
        );

        res.json({
          message: "Resume uploaded",
          resume: result.secure_url,
          user
        });
      }
    );

    // send buffer
    result.end(req.file.buffer);

  } catch (err) {
    res.json({ error: err.message });
  }
};

// DELETE RESUME
export const deleteResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.resumePublicId) {
      return res.json({ message: "No resume found" });
    }

    // delete from cloudinary
    await cloudinary.uploader.destroy(user.resumePublicId, {
      resource_type: "raw"
    });

    // remove from DB
    user.resume = "";
    user.resumePublicId = "";
    await user.save();

    res.json({
      message: "Resume deleted successfully"
    });

  } catch (err) {
    res.json({ error: err.message });
  }
};