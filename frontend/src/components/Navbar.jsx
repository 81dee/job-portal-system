import { Link, useLocation } from "react-router-dom";
import { FaHome, FaBriefcase, FaUser, FaUserTie } from "react-icons/fa";
import "../assets/styles/navbar.css";

export default function Navbar() {
  const location = useLocation();

  return (
      <nav className="navbar">
         <h2 className="logo">JobPortal</h2>

           <div className="nav-links">
             <Link className={location.pathname === "/" ? "active" : ""} to="/">
             <FaHome /> Home
             </Link>

             <Link className={location.pathname === "/jobs" ? "active" : ""} to="/jobs">
             <FaBriefcase /> Jobs
             </Link>

             <Link className={location.pathname === "/dashboard" ? "active" : ""} to="/dashboard">
             <FaUser /> Dashboard
             </Link>

             <Link className={location.pathname === "/recruiter" ? "active" : ""} to="/recruiter">
             <FaUserTie /> Recruiter
             </Link>
          </div>
      </nav>
   );
}