import { Link } from "react-router-dom";
import "../assets/styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <div>
          <p className="footer__brand">
            Job<span>Portal</span>
          </p>
          <p className="footer__tagline">
            Find roles, track applications, and connect with recruiters on one
            polished platform.
          </p>
        </div>

        <div>
          <p className="footer__heading">Explore</p>
          <ul className="footer__links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/jobs">Browse jobs</Link>
            </li>
            <li>
              <Link to="/register">Create account</Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="footer__heading">Account</p>
          <ul className="footer__links">
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/admin-login">Admin</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        © {new Date().getFullYear()} Deepak Singh · MERN Job Portal
      </div>
    </footer>
  );
}
