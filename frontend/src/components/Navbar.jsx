import "./../assets/styles/navbar.css";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  return (
    <div className="navbar">
      <Link className={location.pathname === "/jobs" ? "active" : ""} to="/jobs">Jobs</Link>
      <Link className={location.pathname === "/dashboard" ? "active" : ""} to="/dashboard">Dashboard</Link>
      <Link className={location.pathname === "/recruiter" ? "active" : ""} to="/recruiter">Recruiter</Link>
    </div>
  );
}