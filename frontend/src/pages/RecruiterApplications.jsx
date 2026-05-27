import { useEffect, useState } from "react";
import API from "../services/api";
import {
  FaUser,
  FaEnvelope,
  FaCheck,
  FaTimes,
  FaBriefcase,
  FaCalendarCheck,
} from "react-icons/fa";
import toast from "react-hot-toast";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import { openResume } from "../utils/uploads";
import { InterviewScheduleFields } from "../components/InterviewCard";

const defaultInterviewFields = {
  interviewDate: "",
  interviewTime: "",
  interviewType: "online",
  meetingLink: "",
  notes: "",
};

export default function RecruiterApplications() {
  const [applications, setApplications] = useState([]);
  const [schedulingId, setSchedulingId] = useState(null);
  const token = localStorage.getItem("token");

  const handleViewResume = async (app) => {
    try {
      await openResume(app);
    } catch (err) {
      toast.error(err.message || "Could not open resume");
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await API.get("/application/recruiter", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = Array.isArray(res.data) ? res.data : [];
      setApplications(
        list.map((app) => ({
          ...app,
          ...defaultInterviewFields,
          interviewDate: app.interviewDate
            ? new Date(app.interviewDate).toISOString().slice(0, 10)
            : "",
          interviewTime: app.interviewTime || "",
        }))
      );
    } catch (error) {
      console.log(error);
      setApplications([]);
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await API.get("/application/recruiter", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!active) return;
        const list = Array.isArray(res.data) ? res.data : [];
        setApplications(
          list.map((app) => ({
            ...app,
            interviewType: "online",
            meetingLink: app.interviewLink || "",
            notes: "",
            interviewDate: app.interviewDate
              ? new Date(app.interviewDate).toISOString().slice(0, 10)
              : "",
            interviewTime: "",
          }))
        );
      } catch (error) {
        console.log(error);
        if (active) setApplications([]);
      }
    })();
    return () => {
      active = false;
    };
  }, [token]);

  const handleInputChange = (id, field, value) => {
    setApplications((prev) =>
      prev.map((app) => (app._id === id ? { ...app, [field]: value } : app))
    );
  };

  const scheduleInterview = async (app) => {
    if (!app.interviewDate || !app.interviewTime) {
      toast.error("Please set interview date and time");
      return;
    }

    setSchedulingId(app._id);
    try {
      const res = await API.post(
        "/interview/schedule",
        {
          applicationId: app._id,
          interviewDate: app.interviewDate,
          interviewTime: app.interviewTime,
          interviewType: app.interviewType || "online",
          meetingLink: app.meetingLink || "",
          notes: app.notes || "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(
        res.data.emailSent
          ? "Interview scheduled — candidate notified by email"
          : "Interview scheduled — in-app notification sent"
      );
      fetchApplications();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to schedule interview"
      );
    } finally {
      setSchedulingId(null);
    }
  };

  const updateStatus = async (app, status) => {
    try {
      const payload =
        status === "accepted"
          ? {
              status,
              message: app.message,
              interviewDate: app.interviewDate,
              // recruiter input uses meetingLink; DB field is interviewLink
              interviewLink: app.meetingLink,
            }
          : {
              status,
              message: app.message,
              interviewDate: "",
              interviewLink: "",
            };

      await API.put(
        `/application/status/${app._id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Application updated");
      fetchApplications();
    } catch (error) {
      console.log(error);
      toast.error("Update failed");
    }
  };

  return (
    <div className="page page--dashboard">
      <PageHeader
        eyebrow="Hiring"
        title="Job applicants"
        subtitle="Schedule interviews with date, time, and meeting link. Candidates receive notification and email."
      />

      {applications.length > 0 ? (
        <div className="grid-cards">
          {applications.map((app) => (
            <article className="card application-review-card" key={app._id}>
              <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FaUser aria-hidden />
                {app.user?.name}
              </h2>
              <p>
                <FaEnvelope aria-hidden /> {app.user?.email}
              </p>
              <p>
                <FaBriefcase aria-hidden /> {app.job?.title}
              </p>

              <div className="applicant-details">
                <p>
                  <strong>Phone:</strong> {app.phone || "N/A"}
                </p>
                <p>
                  <strong>Qualification:</strong> {app.qualification || "N/A"}
                </p>
                <p>
                  <strong>Experience:</strong> {app.experience || "N/A"}
                </p>
                <p>
                  <strong>Skills:</strong> {app.skills || "N/A"}
                </p>
              </div>

              {app.resume && (
                <button
                  type="button"
                  className="meeting-link"
                  style={{
                    display: "inline-block",
                    marginBottom: "var(--space-3)",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => handleViewResume(app)}
                >
                  View resume
                </button>
              )}

              <textarea
                placeholder="Message to applicant (optional)"
                value={app.message || ""}
                onChange={(e) =>
                  handleInputChange(app._id, "message", e.target.value)
                }
              />

              <InterviewScheduleFields
                values={app}
                onChange={(field, value) =>
                  handleInputChange(app._id, field, value)
                }
              />

              <Button
                block
                disabled={schedulingId === app._id}
                onClick={() => scheduleInterview(app)}
              >
                <FaCalendarCheck aria-hidden />
                {schedulingId === app._id
                  ? "Scheduling…"
                  : "Schedule interview & notify"}
              </Button>

              <div className="application-review-card__actions">
                <Button
                  variant="secondary"
                  onClick={() =>
                    updateStatus(app, "accepted")
                  }
                >
                  <FaCheck aria-hidden /> Accept only
                </Button>
                <Button
                  variant="danger"
                  onClick={() =>
                    updateStatus(app, "rejected")
                  }
                >
                  <FaTimes aria-hidden /> Reject
                </Button>
              </div>

              <Badge
                variant={
                  app.status === "accepted"
                    ? "success"
                    : app.status === "rejected"
                      ? "danger"
                      : "warning"
                }
              >
                {app.status}
              </Badge>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No applications yet"
          description="Applications will appear here when candidates apply."
        />
      )}
    </div>
  );
}
