import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBriefcase,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaBell,
  FaCalendarAlt,
  FaUser,
} from "react-icons/fa";
import API from "../services/api";
import { getStoredToken } from "../hooks/useAuth";
import Notifications from "../components/Notifications";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";

export default function Dashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    rejected: 0,
    pending: 0,
  });

  const token = getStoredToken();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const load = async () => {
      try {
        const [appsRes, statsRes] = await Promise.all([
          API.get("/application/my", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          API.get("/application/jobseeker-stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setApplications(Array.isArray(appsRes.data) ? appsRes.data : []);
        setStats(statsRes.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (token) load();
  }, [token]);

  return (
    <div className="page page--dashboard">
      <div className="profile-strip animate-in">
        <div className="profile-strip__avatar" aria-hidden>
          <FaUser />
        </div>
        <div>
          <h2>{user?.name || "Job seeker"}</h2>
          <p style={{ opacity: 0.85, fontSize: "var(--text-sm)" }}>
            {user?.email}
          </p>
          <span className="profile-strip__role">Job seeker</span>
        </div>
      </div>

      <div className="grid-stats" style={{ marginBottom: "var(--space-10)" }}>
        <StatCard
          icon={FaBriefcase}
          value={stats.total}
          label="Total applied"
          tone="primary"
        />
        <StatCard
          icon={FaCheckCircle}
          value={stats.accepted}
          label="Accepted"
          tone="success"
        />
        <StatCard
          icon={FaTimesCircle}
          value={stats.rejected}
          label="Rejected"
          tone="danger"
        />
        <StatCard
          icon={FaClock}
          value={stats.pending}
          label="Pending"
          tone="warning"
        />
      </div>

      <PageHeader
        eyebrow="Tracker"
        title="My applications"
        subtitle="Status updates and interview details from recruiters."
      />

      {applications.length > 0 ? (
        <div className="grid-cards">
          {applications.map((app) => (
            <article key={app._id} className="card app-card">
              <div className="app-card__header">
                <h3>{app.job?.title}</h3>
                <p className="app-card__company">{app.job?.companyName}</p>
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

              {app.message && (
                <div className="message-box">
                  <FaBell aria-hidden />
                  <p>{app.message}</p>
                </div>
              )}

              {app.interviewDate && (
                <div className="interview-box">
                  <FaCalendarAlt aria-hidden />
                  <div>
                    <p style={{ fontWeight: 600 }}>Interview scheduled</p>
                    <span>
                      {new Date(app.interviewDate).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {app.interviewLink && (
                <a
                  href={app.interviewLink}
                  target="_blank"
                  rel="noreferrer"
                  className="meeting-link"
                >
                  Join interview
                </a>
              )}
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No applications yet"
          description="Browse open roles and submit your first application."
          actionLabel="Browse jobs"
          onAction={() => navigate("/jobs")}
        />
      )}

      <div style={{ marginTop: "var(--space-12)" }}>
        <Notifications showPanel />
      </div>
    </div>
  );
}
