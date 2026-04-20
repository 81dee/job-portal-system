import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import "../assets/styles/dashboard.css";

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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard">
        <h2>Dashboard</h2>

         {data.map((item) => (
            <div className="card" key={item._id}>
             <h4>{item.job?.title}</h4>
             <p>Status: {item.status}</p>
            </div>
        ))}
    </div> 
   );
}