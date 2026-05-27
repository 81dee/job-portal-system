import { FaCalendarAlt, FaClock, FaLink, FaVideo, FaBuilding } from "react-icons/fa";
import Badge from "./ui/Badge";
function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function statusVariant(status) {
  if (status === "completed") return "success";
  if (status === "cancelled") return "danger";
  if (status === "rescheduled") return "primary";
  return "warning";
}

export default function InterviewCard({ interview }) {
  const job = interview.jobId;
  const recruiter = interview.recruiterId;

  return (
    <article className="card interview-card animate-in">
      <div className="interview-card__header">
        <div>
          <h3>{job?.title || "Interview"}</h3>
          <p className="interview-card__company">
            {job?.companyName || recruiter?.companyName || "Company"}
          </p>
        </div>
        <Badge variant={statusVariant(interview.status)}>
          {interview.status}
        </Badge>
      </div>

      <p className="interview-card__message">
        Your interview is scheduled on this date — please be prepared.
      </p>

      <ul className="interview-card__meta">
        <li>
          <FaCalendarAlt aria-hidden />
          <span>{formatDate(interview.interviewDate)}</span>
        </li>
        <li>
          <FaClock aria-hidden />
          <span>{interview.interviewTime}</span>
        </li>
        <li>
          <FaVideo aria-hidden />
          <span style={{ textTransform: "capitalize" }}>{interview.interviewType}</span>
        </li>
        {recruiter?.name && (
          <li>
            <FaBuilding aria-hidden />
            <span>Recruiter: {recruiter.name}</span>
          </li>
        )}
      </ul>

      {interview.notes && (
        <p className="interview-card__notes">
          <strong>Notes:</strong> {interview.notes}
        </p>
      )}

      {interview.meetingLink && (
        <a
          href={interview.meetingLink}
          target="_blank"
          rel="noreferrer"
          className="meeting-link"
        >
          <FaLink aria-hidden /> Join meeting
        </a>
      )}
    </article>
  );
}

export function InterviewScheduleFields({ values, onChange }) {
  return (
    <div className="interview-schedule-fields">
      <label className="form-label">Interview date</label>
      <input
        type="date"
        className="form-input"
        style={{ width: "100%", marginBottom: "var(--space-3)", padding: "0.75rem 1rem" }}
        value={values.interviewDate || ""}
        onChange={(e) => onChange("interviewDate", e.target.value)}
        required
      />

      <label className="form-label">Interview time</label>
      <input
        type="time"
        className="form-input"
        style={{ width: "100%", marginBottom: "var(--space-3)", padding: "0.75rem 1rem" }}
        value={values.interviewTime || ""}
        onChange={(e) => onChange("interviewTime", e.target.value)}
        required
      />

      <label className="form-label">Interview type</label>
      <select
        className="form-input"
        style={{ width: "100%", marginBottom: "var(--space-3)", padding: "0.75rem 1rem" }}
        value={values.interviewType || "online"}
        onChange={(e) => onChange("interviewType", e.target.value)}
      >
        <option value="online">Online</option>
        <option value="onsite">On-site</option>
        <option value="phone">Phone</option>
      </select>

      <label className="form-label">Meeting link</label>
      <input
        type="url"
        placeholder="https://meet.google.com/..."
        className="form-input"
        style={{ width: "100%", marginBottom: "var(--space-3)", padding: "0.75rem 1rem" }}
        value={values.meetingLink || ""}
        onChange={(e) => onChange("meetingLink", e.target.value)}
      />

      <label className="form-label">Notes (optional)</label>
      <textarea
        placeholder="Bring portfolio, ID proof, etc."
        className="form-input"
        style={{ width: "100%", minHeight: "72px", padding: "0.75rem 1rem" }}
        value={values.notes || ""}
        onChange={(e) => onChange("notes", e.target.value)}
      />
    </div>
  );
}
