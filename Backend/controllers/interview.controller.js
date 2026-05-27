import Interview from "../models/interview.js";
import Application from "../models/application.js";
import Job from "../models/job.js";
import User from "../models/user.js";
import Notification from "../models/notification.js";
import { sendInterviewEmail } from "../utils/mailer.js";

function buildInterviewMessage(jobTitle, interviewDate, interviewTime) {
  const dateStr = new Date(interviewDate).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return `Your interview for ${jobTitle} is scheduled on ${dateStr} at ${interviewTime}. Please be prepared.`;
}

async function assertRecruiterOwnsJob(recruiterId, jobId) {
  const job = await Job.findById(jobId);
  if (!job) return { ok: false, status: 404, message: "Job not found" };
  if (String(job.createdBy) !== String(recruiterId)) {
    return { ok: false, status: 403, message: "Not authorized for this job" };
  }
  return { ok: true, job };
}

// POST /api/interview/schedule — recruiter
export const scheduleInterview = async (req, res) => {
  try {
    const {
      applicationId,
      interviewDate,
      interviewTime,
      interviewType = "online",
      meetingLink = "",
      notes = "",
    } = req.body;

    if (!applicationId || !interviewDate || !interviewTime) {
      return res.status(400).json({
        success: false,
        message: "applicationId, interviewDate, and interviewTime are required",
      });
    }

    const application = await Application.findById(applicationId).populate(
      "job",
      "title companyName createdBy"
    );

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const jobCheck = await assertRecruiterOwnsJob(req.user.id, application.job._id);
    if (!jobCheck.ok) {
      return res.status(jobCheck.status).json({ success: false, message: jobCheck.message });
    }

    const candidate = await User.findById(application.user);
    if (!candidate) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }

    const scheduledAt = new Date(interviewDate);
    if (Number.isNaN(scheduledAt.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid interview date" });
    }

    const notifyText = buildInterviewMessage(
      application.job.title,
      scheduledAt,
      interviewTime
    );

    let interview = await Interview.findOne({
      applicationId: application._id,
      status: { $in: ["scheduled", "rescheduled"] },
    });

    if (interview) {
      interview.interviewDate = scheduledAt;
      interview.interviewTime = interviewTime;
      interview.interviewType = interviewType;
      interview.meetingLink = meetingLink;
      interview.notes = notes;
      interview.status = "rescheduled";
      await interview.save();
    } else {
      interview = await Interview.create({
        recruiterId: req.user.id,
        candidateId: application.user,
        jobId: application.job._id,
        applicationId: application._id,
        interviewDate: scheduledAt,
        interviewTime,
        interviewType,
        meetingLink,
        notes,
        status: "scheduled",
      });
    }

    application.status = "accepted";
    application.message = notifyText;
    application.interviewDate = scheduledAt.toISOString();
    application.interviewLink = meetingLink;
    await application.save();

    await Notification.create({
      user: application.user,
      text: notifyText,
    });

    const emailResult = await sendInterviewEmail({
      to: candidate.email,
      candidateName: candidate.name || application.fullName || "Candidate",
      jobTitle: application.job.title,
      companyName: application.job.companyName,
      interviewDate: scheduledAt,
      interviewTime,
      interviewType,
      meetingLink,
      message: notifyText,
    });

    const populated = await Interview.findById(interview._id)
      .populate("candidateId", "name email")
      .populate("jobId", "title companyName")
      .populate("recruiterId", "name email companyName");

    return res.status(201).json({
      success: true,
      message: "Interview scheduled successfully",
      interview: populated,
      emailSent: emailResult.sent,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/interview/recruiter — recruiter
export const getRecruiterInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ recruiterId: req.user.id })
      .populate("candidateId", "name email")
      .populate("jobId", "title companyName")
      .sort({ interviewDate: 1 });

    return res.json(interviews);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET /api/interview/my — candidate (jobseeker)
export const getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ candidateId: req.user.id })
      .populate("jobId", "title companyName location workMode")
      .populate("recruiterId", "name email companyName")
      .sort({ interviewDate: 1 });

    return res.json(interviews);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// PUT /api/interview/:id/status — recruiter
export const updateInterviewStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["scheduled", "completed", "cancelled", "rescheduled"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }

    if (String(interview.recruiterId) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    interview.status = status;
    await interview.save();

    if (status === "cancelled") {
      await Notification.create({
        user: interview.candidateId,
        text: "Your scheduled interview has been cancelled. The recruiter will contact you if rescheduled.",
      });
    }

    return res.json({ success: true, interview });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET /api/interview/:id — recruiter or candidate
export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate("candidateId", "name email")
      .populate("jobId", "title companyName")
      .populate("recruiterId", "name email companyName");

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const isRecruiter = String(interview.recruiterId._id || interview.recruiterId) === String(req.user.id);
    const isCandidate = String(interview.candidateId._id || interview.candidateId) === String(req.user.id);

    if (!isRecruiter && !isCandidate && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    return res.json(interview);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
