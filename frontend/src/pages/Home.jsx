import { Link } from "react-router-dom";
import "../assets/styles/home.css";

export default function Home() {
  return (
    <div className="home-container">
      <div className="hero">
        <h1>
          Find Your Dream Job <span>Faster 🚀</span>
        </h1>

        <p>
          Apply to jobs, track applications, and connect with recruiters —
          all in one place.
        </p>

        <div className="hero-buttons">
          <Link to="/jobs">
            <button className="btn primary">Browse Jobs</button>
          </Link>

          <Link to="/login">
            <button className="btn secondary">Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
}