import { useEffect, useState } from "react";

import API from "../services/api";

import Loader from "../components/Loader";

import ApplyModal from "../components/ApplyModal";

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

  const [category, setCategory] = useState("All");

  const [selectedJob, setSelectedJob] = useState(null);

  // FETCH JOBS
  const fetchJobs = async () => {

    try {

      const res = await API.get("/job");

      setJobs(

        Array.isArray(res.data)

          ? res.data

          : []
      );

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchJobs();

  }, []);

  if (loading) return <Loader />;

  // CATEGORIES
  const categories = [

    "All",
    "Technology",
    "Finance",
    "Healthcare",
    "Marketing",
    "Education",
    "Design",
    "Cyber Security",
    "AI/ML",
    "Data Science",
    "Law"
  ];

  // FILTER
  const filteredJobs = jobs.filter((job) => {

    const searchText =

      search.toLowerCase();

    const matchesSearch =

      job.title
        ?.toLowerCase()
        .includes(searchText)

      ||

      job.companyName
        ?.toLowerCase()
        .includes(searchText)

      ||

      job.category
        ?.toLowerCase()
        .includes(searchText)

      ||

      job.industry
        ?.toLowerCase()
        .includes(searchText)

      ||

      job.education
        ?.toLowerCase()
        .includes(searchText)

      ||

      job.skillsRequired
        ?.join(" ")
        .toLowerCase()
        .includes(searchText);

    const matchesCategory =

      category === "All"

      ||

      job.category === category;

    return (

      matchesSearch &&

      matchesCategory
    );
  });

  // SORT
  filteredJobs.sort((a, b) => {

    const searchText =

      search.toLowerCase();

    const aExact =

      a.companyName
        ?.toLowerCase()
        .includes(searchText);

    const bExact =

      b.companyName
        ?.toLowerCase()
        .includes(searchText);

    return bExact - aExact;
  });

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
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* CATEGORY FILTER */}
      <div className="category-filter">

        {categories.map((cat) => (

          <button

            key={cat}

            className={
              category === cat
                ? "category-btn active-category"
                : "category-btn"
            }

            onClick={() =>
              setCategory(cat)
            }
          >

            {cat}

          </button>

        ))}

      </div>

      {/* JOBS GRID */}
      <div className="jobs-grid">

        {filteredJobs.map((job) => (

          <div
            className="job-card"
            key={job._id}
          >

            {/* TOP */}
            <div className="job-top">

              <div>

                <h2>

                  {job.title}

                </h2>

                <p className="company-name">

                  {job.companyName ||
                    "Tech Company"}

                </p>

              </div>

              <span className="job-badge">

                {job.category ||
                  "Technology"}

              </span>

            </div>

            {/* DESCRIPTION */}
            <p className="job-description">

              {job.description
                ?.slice(0, 140) ||

                "Great opportunity"}...

            </p>

            {/* BASIC INFO */}
            <div className="job-info">

              {/* LOCATION */}
              <div>

                <FaMapMarkerAlt />

                <span>

                  {job.location ||
                    "Remote"}

                </span>

              </div>

              {/* SALARY */}
              <div>

                <FaMoneyBillWave />

                <span>

                  ₹{job.salary ||
                    "Not Disclosed"}

                </span>

              </div>

              {/* WORK MODE */}
              <div>

                <FaBriefcase />

                <span>

                  {job.workMode ||
                    "Full Time"}

                </span>

              </div>

            </div>

            {/* EXTRA INFO */}
            <div className="extra-job-info">

              {/* INDUSTRY */}
              <div className="info-item">

                <span className="label">

                  Industry

                </span>

                <span className="value">

                  {job.industry ||
                    "General"}

                </span>

              </div>

              {/* EDUCATION */}
              <div className="info-item">

                <span className="label">

                  Education

                </span>

                <span className="value">

                  {job.education ||
                    "Any Graduate"}

                </span>

              </div>

              {/* EXPERIENCE */}
              <div className="info-item">

                <span className="label">

                  Experience

                </span>

                <span className="value">

                  {job.experienceRequired ||
                    "Fresher"}

                </span>

              </div>

              {/* SKILLS */}
              <div className="info-item">

                <span className="label">

                  Skills

                </span>

                <span className="value">

                  {job.skillsRequired?.join(", ")
                    ||
                    "Communication"}

                </span>

              </div>

            </div>

            {/* ACTION BUTTONS */}
            <div className="job-actions">

              {job.status === "Open" ? (

                <button
                  className="apply-btn"
                  onClick={() =>
                    setSelectedJob(job)
                  }
                >

                  Apply Now

                </button>

              ) : (

                <button
                  className="closed-btn"
                  disabled
                >

                  Closed

                </button>
              )}

              <button
                className="details-btn"
              >

                Details

              </button>

            </div>

          </div>
        ))}

      </div>

      {/* APPLY MODAL */}
      {selectedJob && (

        <ApplyModal

          job={selectedJob}

          closeModal={() =>
            setSelectedJob(null)
          }
        />
      )}

    </div>
  );
}