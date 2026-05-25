import Application from "../models/application.js";
import Job from "../models/job.js";
import Notification from "../models/notification.js";
import { uploadResumeFile, isCloudinaryConfigured } from "../utils/cloudinaryUpload.js";
import { attachResumeUrl } from "../utils/resumeUrl.js";

// APPLY JOB
export const applyJob = async (req, res) => {

  try {

    const { jobId } = req.params;

    const {

      fullName,
      email,
      phone,
      qualification,
      experience,
      skills,
      currentCompany,
      expectedSalary,
      location

    } = req.body;

    // CHECK ALREADY APPLIED
    const exists = await Application.findOne({

      job: jobId,

      user: req.user.id
    });

    if (exists) {

      return res.status(400).json({

        message: "Already applied"
      });
    }

    // FIND JOB
    const job = await Job.findById(jobId);

    if (!job) {

      return res.status(404).json({

        message: "Job not found"
      });
    }

    let resumeValue = null;

    if (req.file) {
      if (isCloudinaryConfigured()) {
        const result = await uploadResumeFile(req.file);
        resumeValue = result.secure_url;
      } else {
        console.warn(
          "Cloudinary not configured — resume stored as filename only (may not work in production)"
        );
        resumeValue =
          req.file.filename ||
          req.file.originalname ||
          `resume-${Date.now()}`;
      }
    }

    // CREATE APPLICATION
    const application = await Application.create({

      job: jobId,

      user: req.user.id,

      recruiter: job.createdBy,

      fullName,

      email,

      phone,

      qualification,

      experience,

      skills,

      currentCompany,

      expectedSalary,

      location,

      resume: resumeValue,

      status: "pending"
    });

    res.json({

      success: true,

      message: "Application submitted",

      application: attachResumeUrl(application)
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      error: err.message
    });
  }
};

// GET MY APPLICATIONS
export const getMyApplications = async (req, res) => {

  try {

    const applications = await Application.find({

      user: req.user.id

    })

    .populate("job")

    .sort({

      createdAt: -1
    });

    res.json(applications.map(attachResumeUrl));

  } catch (err) {

    res.json({

      error: err.message
    });
  }
};

// UPDATE APPLICATION STATUS
export const updateApplicationStatus = async (req, res) => {

  try {

    const { applicationId } = req.params;

    const {

      status,
      message,
      interviewDate,
      interviewLink

    } = req.body;

    const application = await Application.findById(

      applicationId
    );

    if (!application) {

      return res.status(404).json({

        message: "Application not found"
      });
    }

    // UPDATE FIELDS
    application.status = status;

    application.message = message;

    application.interviewDate = interviewDate;

    application.interviewLink = interviewLink;

    await Notification.create({

     user: application.user,

     text: `Your application for ${application.job} was ${status}`
   });

    await application.save();

    res.status(200).json({

      success: true,

      message: "Application updated",

      application
    });

  } catch (err) {

    res.status(500).json({

      error: err.message
    });
  }
};

// GET ALL APPLICATIONS
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find();

    res.json(applications);
  } catch (err) {
    res.json({ error: err.message });
  }
}; 

// DELETE APPLICATION
export const deleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.json({ message: "Application not found" });
    }

    await Application.findByIdAndDelete(applicationId);

    res.json({
      message: "Application deleted successfully"
    });

  } catch (err) {
    res.json({ error: err.message });
  }
};

// filter by status
export const getRecruiterApplications = async (

  req,

  res

) => {

  try {

    const jobs = await Job.find({

      createdBy: req.user.id
    });

    const jobIds = jobs.map(

      job => job._id
    );

    const applications = await Application.find({

      job: { $in: jobIds }
    })

    .populate(

      "user",

      "name email"
    )

    .populate(

      "job",

      "title companyName"
    )

    .sort({

      createdAt: -1
    });

    res.json(applications.map(attachResumeUrl));

  } catch (err) {

    res.json({

      error: err.message
    });
  }
};

// VIEW / DOWNLOAD RESUME (recruiter or applicant)
export const getApplicationResume = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId)
      .populate("job", "title companyName createdBy");

    if (!application || !application.resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const isRecruiter =
      req.user.role === "recruiter" &&
      application.job &&
      String(application.job.createdBy) === String(req.user.id);

    const isOwner = String(application.user) === String(req.user.id);

    if (!isRecruiter && !isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Cloudinary / external URL
    if (/^https?:\/\//i.test(application.resume)) {
      return res.redirect(application.resume);
    }

    // Local file (dev only — ephemeral on Render)
    const fs = await import("fs");
    const path = await import("path");
    const { fileURLToPath } = await import("url");
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const fileName = application.resume
      .replace(/\\/g, "/")
      .replace(/^\/?uploads\//, "");
    const filePath = path.join(__dirname, "..", "uploads", fileName);

    if (fs.existsSync(filePath)) {
      return res.download(filePath, fileName);
    }

    return res.status(404).json({
      message:
        "Resume file is no longer on the server. Ask the applicant to submit again.",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const filterApplications = async (req, res) => {
  try {
    const { status } = req.query;

    const jobs = await Job.find({ createdBy: req.user.id });
    const jobIds = jobs.map(job => job._id);

    const applications = await Application.find({
      job: { $in: jobIds },
      status
    });

    res.json(applications);

  } catch (err) {
    res.json({ error: err.message });
  }
};

// Dashboard Stats

export const getDashboardStats = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user.id });
    const jobIds = jobs.map(job => job._id);

    const total = await Application.countDocuments({ job: { $in: jobIds } });

    const accepted = await Application.countDocuments({
      job: { $in: jobIds },
      status: "accepted"
    });

    const rejected = await Application.countDocuments({
      job: { $in: jobIds },
      status: "rejected"
    });

    const pending = await Application.countDocuments({
      job: { $in: jobIds },
      status: "pending"
    });

    res.json({
      total,
      accepted,
      rejected,
      pending
    });

  } catch (err) {
    res.json({ error: err.message });
  }
};

export const getJobseekerStats = async (req, res) => {

  try {

    const total = await Application.countDocuments({

      user: req.user.id
    });

    const accepted = await Application.countDocuments({

      user: req.user.id,

      status: "accepted"
    });

    const rejected = await Application.countDocuments({

      user: req.user.id,

      status: "rejected"
    });

    const pending = await Application.countDocuments({

      user: req.user.id,

      status: "pending"
    });

    res.status(200).json({

      total,

      accepted,

      rejected,

      pending
    });

  } catch (error) {

    res.status(500).json({

      error: error.message
    });
  }
};