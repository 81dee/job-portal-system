import { useEffect, useState } from "react";

import API from "../services/api";

import Loader from "../components/Loader";

import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaBriefcase,
  FaSearch
} from "react-icons/fa";

import "../assets/styles/jobs.css";

export default function Jobs() {

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const fetchJobs = async () => {

    try {

      const res = await API.get("/job");

      setJobs(Array.isArray(res.data) ? res.data : []);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const applyJob = async (jobId) => {

    try {

      await API.post(`/application/apply/${jobId}`);

      alert("Applied Successfully");

    } catch (err) {

      console.log(err);

      alert("Error applying");
    }
  };

  if (loading) return <Loader />;

  const filteredJobs = jobs.filter((job) =>
    job.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="jobs-page">

      {/* HEADER */}
      <div className="jobs-header">

        <h1>
          Available Jobs
        </h1>

        <p>
          Find opportunities from top companies
        </p>

      </div>

      {/* SEARCH */}
      <div className="search-container">

        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {/* JOBS */}
      <div className="jobs-grid">

        {filteredJobs.map((job) => (

          <div className="job-card" key={job._id}>

            {/* TOP */}
            <div className="job-top">

              <div>

                <h2>
                  {job.title}
                </h2>

                <p className="company-name">
                  {job.company?.companyName || "Tech Company"}
                </p>

              </div>

              <span className="job-badge">
                {job.category || "Technology"}
              </span>

            </div>

            {/* DESCRIPTION */}
            <p className="job-description">

              {job.description?.slice(0, 120) || "Great opportunity"}...

            </p>

            {/* INFO */}
            <div className="job-info">

              <div>
                <FaMapMarkerAlt />
                <span>
                  {job.location?.city || "Remote"}
                </span>
              </div>

              <div>
                <FaMoneyBillWave />
                <span>
                  ₹{job.salaryPackage?.min || "5L"} -
                  ₹{job.salaryPackage?.max || "12L"}
                </span>
              </div>

              <div>
                <FaBriefcase />
                <span>
                  {job.workMode || "Full Time"}
                </span>
              </div>

            </div>

            {/* BUTTONS */}
            <div className="job-actions">

              <button
                className="apply-btn"
                onClick={() => applyJob(job._id)}
              >
                Apply Now
              </button>

              <button className="details-btn">
                Details
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}