import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaBriefcase,
} from "react-icons/fa";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

export default function JobCard({ job, onApply }) {
  const skills = Array.isArray(job.skillsRequired)
    ? job.skillsRequired.join(", ")
    : job.skillsRequired || "—";

  return (
    <article className="card card--interactive job-card">
      <div className="job-card__top">
        <div>
          <h2 className="job-card__title">{job.title}</h2>
          <p className="job-card__company">
            {job.companyName || "Company"}
          </p>
        </div>
        <Badge>{job.category || "General"}</Badge>
      </div>

      <p className="job-card__desc">
        {job.description?.slice(0, 140) || "Exciting opportunity awaits."}
        …
      </p>

      <div className="job-card__meta">
        <span>
          <FaMapMarkerAlt aria-hidden /> {job.location || "Remote"}
        </span>
        <span>
          <FaMoneyBillWave aria-hidden /> ₹{job.salary || "Not disclosed"}
        </span>
        <span>
          <FaBriefcase aria-hidden /> {job.workMode || "Full-time"}
        </span>
      </div>

      <div className="job-card__details">
        <div>
          <span className="job-card__detail-label">Industry</span>
          <span>{job.industry || "General"}</span>
        </div>
        <div>
          <span className="job-card__detail-label">Education</span>
          <span>{job.education || "Any graduate"}</span>
        </div>
        <div>
          <span className="job-card__detail-label">Experience</span>
          <span>{job.experienceRequired || "Fresher"}</span>
        </div>
        <div>
          <span className="job-card__detail-label">Skills</span>
          <span>{skills}</span>
        </div>
      </div>

      <div className="job-card__actions">
        {job.status === "Open" ? (
          <Button onClick={() => onApply(job)}>Apply now</Button>
        ) : (
          <Button disabled variant="secondary">
            Closed
          </Button>
        )}
        <Button variant="secondary" type="button">
          Details
        </Button>
      </div>
    </article>
  );
}
