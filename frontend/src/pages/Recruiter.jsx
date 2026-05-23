import { useEffect, useState } from "react";

import API from "../services/api";

import {
  FaTrash,
  FaBriefcase,
  FaPlusCircle,
  FaEdit,
  FaUsers
} from "react-icons/fa";

import { Link } from "react-router-dom";

import "../assets/styles/recruiter.css";

export default function Recruiter() {

  const [jobs, setJobs] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({

    title: "",
    description: "",
    category: "Technology",
    workMode: "Remote",
    companyName: "",
    salary: "",
    location: ""

  });

  // TOKEN
  const token = localStorage.getItem("token");

  // USER
  const user = JSON.parse(

    localStorage.getItem("user")
  );

  // CONFIG
  const config = {

    headers: {

      Authorization: `Bearer ${token}`
    }
  };

  // FETCH JOBS
  const fetchRecruiterJobs = async () => {

    try {

      const res = await API.get(

        "/job/recruiter-jobs",

        config
      );

      console.log("RECRUITER JOBS:", res.data);

      setJobs(

        Array.isArray(res.data)

          ? res.data

          : []
      );

    } catch (error) {

      console.log(error);

      alert(

        error?.response?.data?.message ||

        "Failed to load jobs"
      );
    }
  };

  // USE EFFECT
  useEffect(() => {

    if (token) {

      fetchRecruiterJobs();
    }

  }, []);

  // HANDLE CHANGE
  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:

        e.target.value
    });
  };

  // EDIT JOB
  const editJob = (job) => {

    setEditingId(job._id);

    setFormData({

      title: job.title || "",

      description:
        job.description || "",

      category:
        job.category || "Technology",

      workMode:
        job.workMode || "Remote",

      companyName:
        job.companyName || "",

      salary:
        job.salary || "",

      location:
        job.location || ""
    });

    window.scrollTo({

      top: 0,

      behavior: "smooth"
    });
  };

  // SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      // CHECK LOGIN
      if (!token) {

        alert("Please login first");

        return;
      }

      // CHECK ROLE
      if (user?.role !== "recruiter") {

        alert(

          "Only recruiters can create jobs"
        );

        return;
      }

      console.log(formData);

      // UPDATE
      if (editingId) {

        await API.put(

          `/job/update/${editingId}`,

          formData,

          config
        );

        alert("Job Updated Successfully");

        setEditingId(null);

      } else {

        // CREATE
        await API.post(

          "/job/create",

          formData,

          config
        );

        alert("Job Created Successfully");
      }

      // RESET FORM
      setFormData({

        title: "",
        description: "",
        category: "Technology",
        workMode: "Remote",
        companyName: "",
        salary: "",
        location: ""

      });

      // REFRESH
      fetchRecruiterJobs();

    } catch (error) {

      console.log(error);

      alert(

        error?.response?.data?.message ||

        "Something went wrong"
      );

    } finally {

      setLoading(false);
    }
  };

  // DELETE
  const deleteJob = async (id) => {

    const confirmDelete = window.confirm(

      "Delete this job?"
    );

    if (!confirmDelete) return;

    try {

      await API.delete(

        `/job/delete/${id}`,

        config
      );

      alert("Job Deleted");

      fetchRecruiterJobs();

    } catch (error) {

      console.log(error);

      alert(

        error?.response?.data?.message ||

        "Delete failed"
      );
    }
  };

  return (

    <div className="recruiter-page">

      {/* DASHBOARD TOP */}
      <div className="dashboard-top">

        <div className="dashboard-card">

          <FaBriefcase />

          <div>

            <h2>{jobs.length}</h2>

            <p>Total Jobs</p>

          </div>

        </div>

        <div className="dashboard-card">

          <FaPlusCircle />

          <div>

            <h2>

              {editingId

                ? "Edit"

                : "Create"}

            </h2>

            <p>

              {editingId

                ? "Update Job"

                : "New Opportunity"}

            </p>

          </div>

        </div>

        <div className="dashboard-card">

          <FaUsers />

          <div>

            <Link
              to="/recruiter-applications"
              className="applicant-link"
            >

              View Applicants

            </Link>

          </div>

        </div>

      </div>

      {/* FORM */}
      <div className="recruiter-container">

        <h1>

          {editingId

            ? "Edit Job"

            : "Create New Job"}

        </h1>

        <form onSubmit={handleSubmit}>

          {/* TITLE */}
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          {/* DESCRIPTION */}
          <textarea
            name="description"
            placeholder="Job Description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          {/* COMPANY */}
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            required
          />

          {/* SALARY */}
          <input
            type="text"
            name="salary"
            placeholder="Salary Package"
            value={formData.salary}
            onChange={handleChange}
            required
          />

          {/* LOCATION */}
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />

          {/* CATEGORY */}
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >

            <option value="Technology">
              Technology
            </option>

            <option value="Finance">
              Finance
            </option>

            <option value="Healthcare">
              Healthcare
            </option>

            <option value="Marketing">
              Marketing
            </option>

            <option value="Education">
              Education
            </option>

          </select>

          {/* WORK MODE */}
          <select
            name="workMode"
            value={formData.workMode}
            onChange={handleChange}
            required
          >

            <option value="Remote">
              Remote
            </option>

            <option value="Hybrid">
              Hybrid
            </option>

            <option value="Onsite">
              Onsite
            </option>

          </select>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
          >

            {loading

              ? "Please Wait..."

              : editingId

              ? "Update Job"

              : "Create Job"}

          </button>

        </form>

      </div>

      {/* JOBS */}
      <div className="recruiter-jobs">

        <h2>Your Posted Jobs</h2>

        <div className="recruiter-jobs-grid">

          {jobs.length > 0 ? (

            jobs.map((job) => (

              <div
                className="recruiter-job-card"
                key={job._id}
              >

                <h3>{job.title}</h3>

                <p>

                  {
                    job.description?.slice(
                      0,
                      120
                    )
                  }...

                </p>

                <span>

                  {job.category}

                </span>

                <div className="job-card-info">

                  <p>

                    <strong>Company:</strong>

                    {job.companyName}

                  </p>

                  <p>

                    <strong>Salary:</strong>

                    {job.salary}

                  </p>

                  <p>

                    <strong>Mode:</strong>

                    {job.workMode}

                  </p>

                </div>

                {/* ACTION BUTTONS */}
                <div className="job-actions">

                  {/* EDIT */}
                  <button
                    className="edit-btn"
                    onClick={() => editJob(job)}
                  >

                    <FaEdit />

                    Edit

                  </button>

                  {/* DELETE */}
                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteJob(job._id)
                    }
                  >

                    <FaTrash />

                    Delete

                  </button>

                </div>

              </div>

            ))

          ) : (

            <div className="no-jobs">

              <h2>

                No Jobs Posted Yet

              </h2>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}