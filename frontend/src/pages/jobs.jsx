import { useEffect, useState } from "react";
import API from "../services/api";
import "../assets/styles/jobs.css";
import Loader from "../components/Loader";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/job"); // backend route
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
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
      alert("Applied successfully");
    } catch (err) {
      console.log(err);
      alert("Error applying");
    }
  };

  if (loading) return <Loader />;

  return (
   <div className="jobs-page">
    <h2 className="page-title">Available Jobs</h2>

    <div className="jobs-grid">
      {jobs.map((job) => (
        <div className="job-card" key={job._id}>
          <h3>{job.title}</h3>
          <p>{job.description}</p>

          <button onClick={() => applyJob(job._id)}>
            Apply Now
          </button>
        </div>
       ))}
      </div>
   </div>
  );
}