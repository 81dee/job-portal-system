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

import toast from "react-hot-toast";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Badge from "../components/ui/Badge";

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
    industry: "",
    education: "",
    skillsRequired: "",
    experienceRequired: "",
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

  useEffect(() => {
    if (!token) return;
    let active = true;
    (async () => {
      try {
        const res = await API.get("/job/recruiter-jobs", config);
        if (active) {
          setJobs(Array.isArray(res.data) ? res.data : []);
        }
      } catch (error) {
        console.log(error);
        if (active) {
          alert(
            error?.response?.data?.message || "Failed to load jobs"
          );
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [token]);

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

      industry:
        job.industry || "",

      education:
        job.education || "",

      skillsRequired:
        job.skillsRequired?.join(", ")
        || "",

      experienceRequired:
        job.experienceRequired || "",

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

        toast.success("Job updated");

        setEditingId(null);

      } else {

        // CREATE
        await API.post(

          "/job/create",

          formData,

          config
        );

        toast.success("Job created");
      }

      // RESET FORM
      setFormData({

        title: "",
        description: "",
        category: "Technology",
        workMode: "Remote",
        companyName: "",
        salary: "",
        industry: "",
        education: "",
        skillsRequired: "", 
        experienceRequired: "",
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

      toast.success("Job deleted");

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

    <div className="page page--dashboard">

      <PageHeader
        eyebrow="Recruiter"
        title="Recruiter dashboard"
        subtitle="Post roles and manage your job listings."
      />

      <div className="grid-stats" style={{ marginBottom: "var(--space-8)" }}>
        <StatCard icon={FaBriefcase} value={jobs.length} label="Total jobs" tone="primary" />
        <StatCard
          icon={FaPlusCircle}
          value={editingId ? "Edit" : "New"}
          label={editingId ? "Update listing" : "Create listing"}
          tone="accent"
        />
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--success">
            <FaUsers aria-hidden />
          </div>
          <div>
            <Link to="/recruiter-applications" className="btn btn--primary btn--sm">
              View applicants
            </Link>
          </div>
        </div>
      </div>

      <div className="recruiter-layout">
      <div className="card card--elevated recruiter-form">

        <h2 style={{ marginBottom: "var(--space-6)" }}>

          {editingId ? "Edit job" : "Create new job"}

        </h2>

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

          {/* INDUSTRY */}
          <input
            type="text"
            name="industry"
            placeholder="Industry (Software, Banking)"
            value={formData.industry}
            onChange={handleChange}
          />

          {/* EDUCATION */}
          <input
            type="text"
            name="education"
            placeholder="Education (BCA, MCA, MBA)"
            value={formData.education}
            onChange={handleChange}
          />

          {/* SKILLS */}
          <input
            type="text"
            name="skillsRequired"
            placeholder="Skills (React, Node, AI)"
            value={formData.skillsRequired}
            onChange={handleChange}
          />

         {/* EXPERIENCE */}
         <input
           type="text"
           name="experienceRequired"
           placeholder="Experience Required"
           value={formData.experienceRequired}
           onChange={handleChange}
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

          <Button type="submit" disabled={loading} block>
            {loading ? "Please wait…" : editingId ? "Update job" : "Create job"}
          </Button>

        </form>

      </div>

      <div>
        <h2 style={{ marginBottom: "var(--space-6)" }}>Your posted jobs</h2>

          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div className="recruiter-job-item" key={job._id}>
                <div>
                  <h3>{job.title}</h3>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", margin: "var(--space-1) 0" }}>
                    {job.description?.slice(0, 100)}…
                  </p>
                  <Badge>{job.category}</Badge>
                  <p style={{ fontSize: "var(--text-sm)", marginTop: "var(--space-2)" }}>
                    {job.companyName} · ₹{job.salary} · {job.workMode}
                  </p>
                </div>
                <div className="recruiter-job-item__actions">
                  <Button variant="secondary" size="sm" onClick={() => editJob(job)}>
                    <FaEdit aria-hidden /> Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => deleteJob(job._id)}>
                    <FaTrash aria-hidden /> Delete
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <EmptyState title="No jobs posted yet" description="Create your first listing using the form." />
          )}
      </div>
      </div>

    </div>
  );
}