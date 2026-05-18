import { Link } from "react-router-dom";

import {
  FaSearch,
  FaBriefcase,
  FaUsers,
  FaBuilding
} from "react-icons/fa";

import "../assets/styles/home.css";

export default function Home() {

  return (

    <div className="home">

      {/* HERO SECTION */}
      <section className="hero-section">

        <div className="hero-content">

          <h1>
            Find Your Dream Job
            <span> Faster 🚀</span>
          </h1>

          <p>
            Apply to jobs, track applications, connect with recruiters,
            and grow your career — all in one professional platform.
          </p>

          {/* SEARCH BAR */}
          <div className="search-box">

            <FaSearch className="search-icon" />

            <input
              type="text"
              placeholder="Search jobs, companies, skills..."
            />

            <button>
              Search
            </button>

          </div>

          {/* BUTTONS */}
          <div className="hero-buttons">

            <Link to="/jobs">
              <button className="btn primary">
                Browse Jobs
              </button>
            </Link>

            <Link to="/login">
              <button className="btn secondary">
                Login
              </button>
            </Link>

            <Link to="/register">
              <button className="btn register">
                Register
              </button>
            </Link>

          </div>

        </div>

      </section>

      {/* STATS */}
      <section className="stats-section">

        <div className="stat-card">
          <FaBriefcase className="stat-icon blue" />
          <h2>5K+</h2>
          <p>Active Jobs</p>
        </div>

        <div className="stat-card">
          <FaUsers className="stat-icon purple" />
          <h2>10K+</h2>
          <p>Job Seekers</p>
        </div>

        <div className="stat-card">
          <FaBuilding className="stat-icon orange" />
          <h2>500+</h2>
          <p>Companies</p>
        </div>

      </section>

      {/* CATEGORIES */}
      <section className="categories-section">

        <h2>Popular Categories</h2>

        <div className="categories-grid">

          <div className="category-card">
            💻 Technology
          </div>

          <div className="category-card">
            💰 Finance
          </div>

          <div className="category-card">
            🏥 Healthcare
          </div>

          <div className="category-card">
            📈 Marketing
          </div>

          <div className="category-card">
            🎨 Design
          </div>

          <div className="category-card">
            🛡 Cyber Security
          </div>

        </div>

      </section>

    </div>
  );
}