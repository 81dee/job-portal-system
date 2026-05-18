import { Link, useLocation } from "react-router-dom";

import {
  FaHome,
  FaBriefcase,
  FaUser,
  FaUserTie,
  FaUserShield,
  FaUserPlus
} from "react-icons/fa";

import "../assets/styles/navbar.css";

export default function Navbar() {

  const location = useLocation();

  return (

    <nav className="navbar">

      <div className="navbar-container">

        {/* Logo */}
        <h2 className="logo">
          Job<span>Portal</span>
        </h2>

        {/* Links */}
        <div className="nav-links">

          <Link
            className={location.pathname === "/" ? "active" : ""}
            to="/"
          >
            <FaHome />
            Home
          </Link>

          <Link
            className={location.pathname === "/jobs" ? "active" : ""}
            to="/jobs"
          >
            <FaBriefcase />
            Jobs
          </Link>

          <Link
            className={location.pathname === "/dashboard" ? "active" : ""}
            to="/dashboard"
          >
            <FaUser />
            Dashboard
          </Link>

          <Link
            className={location.pathname === "/recruiter" ? "active" : ""}
            to="/recruiter"
          >
            <FaUserTie />
            Recruiter
          </Link>

          <Link
            className={location.pathname === "/admin" ? "active admin-link" : "admin-link"}
            to="/admin"
          >
            <FaUserShield />
            Admin
          </Link>

        </div>

        {/* Buttons */}
        <div className="nav-buttons">

          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/register" className="register-btn">
            <FaUserPlus />
            Register
          </Link>

        </div>

      </div>

    </nav>
  );
}