import { useEffect, useState } from "react";

import API from "../services/api";

import {
  FaTrash,
  FaBriefcase,
  FaPlusCircle,
  FaEdit
} from "react-icons/fa";

import "../assets/styles/recruiter.css";

export default function Recruiter() {

  const [jobs, setJobs] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({

    title: "",
    description: "",
    category: "",
    workMode: "",
    companyName: "",
    salary: ""

  });

  // FETCH JOBS
  const fetchRecruiterJobs = async () => {

    try {

      const res = await API.get("/job/recruiter-jobs");

      setJobs(res.data);

    } catch (error) {

      console.log(error);
    }
  };

  // USE EFFECT
  useEffect(() => {

    fetchRecruiterJobs();

  }, []);

  // HANDLE CHANGE
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // EDIT JOB
  const editJob = (job) => {

    setEditingId(job._id);

    setFormData({

      title: job.title || "",
      description: job.description || "",
      category: job.category || "",
      workMode: job.workMode || "",
      companyName: job.companyName || "",
      salary: job.salary || ""

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

      if (editingId) {

        await API.put(
          `/job/update/${editingId}`,
          formData
        );

        alert("Job Updated");

        setEditingId(null);

      } else {

        await API.post(
          "/job/create",
          formData
        );

        alert("Job Created");
      }

      // RESET
      setFormData({

        title: "",
        description: "",
        category: "",
        workMode: "",
        companyName: "",
        salary: ""

      });

      fetchRecruiterJobs();

    } catch (error) {

      console.log(error);

      alert("Something went wrong");
    }
  };

  // DELETE
  const deleteJob = async (id) => {

    try {

      await API.delete(`/job/delete/${id}`);

      alert("Job Deleted");

      fetchRecruiterJobs();

    } catch (error) {

      console.log(error);

      alert("Delete failed");
    }
  };

  return (

    <div className="recruiter-page">

      {/* TOP DASHBOARD */}
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
              {editingId ? "Edit" : "Create"}
            </h2>
            <p>
              {editingId ? "Update Job" : "New Opportunity"}
            </p>
          </div>
        </div>

      </div>

      {/* FORM */}
      <div className="recruiter-container">

        <h1>
          {editingId ? "Edit Job" : "Create New Job"}
        </h1>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Job Description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="salary"
            placeholder="Salary Package"
            value={formData.salary}
            onChange={handleChange}
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >

            <option value="">Select Category</option>

            <option>Technology</option>
            <option>Finance</option>
            <option>Healthcare</option>
            <option>Marketing</option>

          </select>

          <select
            name="workMode"
            value={formData.workMode}
            onChange={handleChange}
          >

            <option value="">Work Mode</option>

            <option>Remote</option>
            <option>Hybrid</option>
            <option>Onsite</option>

          </select>

          <button type="submit">

            {editingId ? "Update Job" : "Create Job"}

          </button>

        </form>

      </div>

      {/* JOBS */}
      <div className="recruiter-jobs">

        <h2>Your Posted Jobs</h2>

        <div className="recruiter-jobs-grid">

          {jobs.map((job) => (

            <div className="recruiter-job-card" key={job._id}>

              <h3>{job.title}</h3>

              <p>
                {job.description?.slice(0, 100)}...
              </p>

              <span>{job.category}</span>

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
                onClick={() => deleteJob(job._id)}
              >
                <FaTrash />
                Delete
              </button>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}