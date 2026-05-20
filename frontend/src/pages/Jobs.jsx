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

  const [category, setCategory] = useState("All");

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

  // APPLY JOB
  const applyJob = async (jobId) => {

    try {

      await API.post(
        `/application/apply/${jobId}`
      );

      alert("Applied Successfully");

    } catch (err) {

      console.log(err);

      alert("Error applying");
    }
  };

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
    "Cyber Security"
  ];

  // FILTER
  const filteredJobs = jobs.filter((job) => {

    const matchesSearch =

      job.title
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =

      category === "All" ||
      job.category === category;

    return matchesSearch && matchesCategory;
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

      {/* JOBS */}
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
                ?.slice(0, 120) ||
                "Great opportunity"}...

            </p>

            {/* INFO */}
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

              {/* MODE */}
              <div>

                <FaBriefcase />

                <span>

                  {job.workMode ||
                    "Full Time"}

                </span>

              </div>

            </div>

            {/* BUTTONS */}
            <div className="job-actions">

              <button
                className="apply-btn"
                onClick={() =>
                  applyJob(job._id)
                }
              >

                Apply Now

              </button>

              <button
                className="details-btn"
              >

                Details

              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}