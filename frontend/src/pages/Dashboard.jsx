import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import "../assets/styles/dashboard.css";
import Loader from "../components/Loader";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Memoize the function so it doesn't change on every render
  const fetchData = useCallback(async () => {
    try {
      const res = await API.get("/application/my");
      // 2. Add a safety check to ensure data is an array before setting state
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // 3. fetchData is now a stable dependency

   if (loading) return <Loader />;

  return (
  <div className="dashboard-page">
    <h2 className="page-title">My Applications</h2>

    {data.length === 0 ? (
      <p className="empty">No applications yet</p>
    ) : (
      <div className="dashboard-list">
        {data.map((item) => (
          <div className="dashboard-card" key={item._id}>
            <h3>{item.job?.title}</h3>

            <span className={`status ${item.status}`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
 );
}