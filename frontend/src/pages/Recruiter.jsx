import { useState, useEffect } from "react";
import API from "../services/api";
import Loader from "../components/Loader";
import "../assets/styles/recruiter.css";

export default function Recruiter() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [applications, setApplications] = useState([]);

  // 1. IMPROVED: Function defined inside useEffect to avoid cascading render warnings
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get("/application/recruiter");
        // Ensure data is an array before setting state
        setApplications(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };

    fetchApplications();
  }, []); // Empty dependency array means this runs ONLY ONCE on mount

  // 2. Job Creation Logic
  const createJob = async () => {
    if (!title || !description) return alert("Please fill all fields");
    
    try {
      await API.post("/job/create", { title, description });
      alert("Job created ✅");
      setTitle(""); // Clear input
      setDescription(""); // Clear input
    } catch (err) {
      alert("Error creating job", err);
    }
  };

  // 3. Status Update Logic
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/application/status/${id}`, { status });
      alert("Updated ✅");
      
      // IMPROVEMENT: Update the local state instead of a full re-fetch to save bandwidth
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status } : app))
      );
    } catch (err) {
      alert("Error updating status", err);
    }
  };

  return (
    <div className="recruiter-page">
      <h2 className="page-title">Recruiter Panel</h2>

      {/* CREATE JOB */}
      <div className="job-form-card">
        <h3>Create Job</h3>

        <input
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Job Description"
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button onClick={createJob}>Create Job</button>
      </div>

      {/* APPLICATIONS */}
      <div className="applications-section">
        <h3>Applications</h3>

        {applications.length === 0 ? (
          <p className="empty">No applications found</p>
        ) : (
          applications.map((app) => (
            <div className="app-card" key={app._id}>
              <div>
                <strong>{app.user?.name}</strong>
                <p>{app.job?.title}</p>
              </div>

              <div className="right-section">
                <span className={`status ${app.status}`}>
                  {app.status}
                </span>

                <div className="action-buttons">
                  <button
                    className="accept"
                    onClick={() => updateStatus(app._id, "accepted")}
                  >
                    Accept
                  </button>

                  <button
                    className="reject"
                    onClick={() => updateStatus(app._id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}