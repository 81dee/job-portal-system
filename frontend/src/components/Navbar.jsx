import {

  Link,

  useLocation,

  useNavigate

} from "react-router-dom";

import {

  FaHome,
  FaBriefcase,
  FaUser,
  FaUsers,
  FaUserTie,
  FaUserShield,
  FaUserPlus,
  FaSignOutAlt

} from "react-icons/fa";

import "../assets/styles/navbar.css";

export default function Navbar() {

  const location = useLocation();

  const navigate = useNavigate();

  // GET USER
  const user = JSON.parse(

    localStorage.getItem("user")
  );

  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    alert("Logged out successfully");

    navigate("/login");
  };

  return (

    <nav className="navbar">

      <div className="navbar-container">

        {/* Logo */}
        <h2 className="logo">

          Job<span>Portal</span>

        </h2>

        {/* Links */}
        <div className="nav-links">

          {/* HOME */}
          <Link
            className={
              location.pathname === "/"
                ? "active"
                : ""
            }
            to="/"
          >

            <FaHome />

            Home

          </Link>

          {/* JOBS */}
          <Link
            className={
              location.pathname === "/jobs"
                ? "active"
                : ""
            }
            to="/jobs"
          >

            <FaBriefcase />

            Jobs

          </Link>

          {/* JOBSEEKER */}
          {user?.role === "jobseeker" && (

            <Link
              className={
                location.pathname === "/dashboard"
                  ? "active"
                  : ""
              }
              to="/dashboard"
            >

              <FaUser />

              Dashboard

            </Link>
          )}

          {/* RECRUITER */}
          {user?.role === "recruiter" && (

           <>

            {/* RECRUITER DASHBOARD */}
              <Link
                className={
                  location.pathname === "/recruiter"
                    ? "active"
                    : ""
              }
              to="/recruiter"
           >

             <FaUserTie />

              Recruiter

           </Link>

           {/* APPLICANTS */}
           <Link
             className={
               location.pathname ===
               "/recruiter-applications"
                 ? "active"
                 : ""
            }
              to="/recruiter-applications"
           >

            <FaUsers />

              Applicants

            </Link>

          </>
        )}

          {/* ADMIN */}
          {user?.role === "admin" && (

            <Link
              className={
                location.pathname === "/admin"
                  ? "active admin-link"
                  : "admin-link"
              }
              to="/admin"
            >

              <FaUserShield />

              Admin

            </Link>
          )}

        </div>

        {/* BUTTONS */}
        <div className="nav-buttons">

          {!user ? (

            <>
              <Link
                to="/login"
                className="login-btn"
              >

                Login

              </Link>

              <Link
                to="/register"
                className="register-btn"
              >

                <FaUserPlus />

                Register

              </Link>
            </>

          ) : (

            <button
              className="logout-btn"
              onClick={handleLogout}
            >

              <FaSignOutAlt />

              Logout

            </button>
          )}

        </div>

      </div>

    </nav>
  );
}