import { useState, useEffect } from "react";
import API from "../services/api";

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
    <div style={{ padding: "20px" }}>
      <h2>Recruiter Panel</h2>

      {/* Create Job Section */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={createJob}>Create Job</button>
      </div>

      <hr />

      {/* Applications List */}
      <h3>Applications</h3>
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        applications.map((app) => (
          <div key={app._id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
            <p><strong>Candidate:</strong> {app.user?.name || "N/A"}</p>
            <p><strong>Job:</strong> {app.job?.title || "N/A"}</p>
            <p><strong>Status:</strong> {app.status}</p>

            <button onClick={() => updateStatus(app._id, "accepted")}>Accept</button>
            <button 
              onClick={() => updateStatus(app._id, "rejected")} 
              style={{ marginLeft: "10px", color: "red" }}
            >
              Reject
            </button>
          </div>
        ))
      )}
    </div>
  );
}