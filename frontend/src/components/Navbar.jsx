import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBriefcase,
  FaUser,
  FaUsers,
  FaUserTie,
  FaUserShield,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import Button from "./ui/Button";
import { useTheme } from "../contexts/useTheme.js";
import "../assets/styles/navbar.css";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: FaHome, roles: null },
  { to: "/jobs", label: "Jobs", icon: FaBriefcase, roles: null },
  { to: "/dashboard", label: "Dashboard", icon: FaUser, roles: ["jobseeker"] },
  { to: "/recruiter", label: "Recruiter", icon: FaUserTie, roles: ["recruiter"] },
  {
    to: "/recruiter-applications",
    label: "Applicants",
    icon: FaUsers,
    roles: ["recruiter"],
  },
  { to: "/admin", label: "Admin", icon: FaUserShield, roles: ["admin"], admin: true },
];

function NavLink({ to, label, icon, isActive, admin }) {
  const Icon = icon;
  return (
    <Link
      to={to}
      className={`navbar__link ${isActive ? "navbar__link--active" : ""} ${admin ? "navbar__link--admin" : ""}`}
      aria-current={isActive ? "page" : undefined}
    >
      {Icon ? <Icon aria-hidden /> : null}
      {label}
    </Link>
  );
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isLoggedIn } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const visibleLinks = NAV_ITEMS.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  const authActions = !isLoggedIn ? (
    <>
      <Link to="/login" className="btn btn--ghost btn--sm">
        Login
      </Link>
      <Link to="/register" className="btn btn--primary btn--sm">
        Register
      </Link>
    </>
  ) : (
    <Button variant="danger" size="sm" onClick={handleLogout}>
      <FaSignOutAlt aria-hidden /> Logout
    </Button>
  );

  const linkList = visibleLinks.map((item) => (
    <NavLink
      key={item.to}
      to={item.to}
      label={item.label}
      icon={item.icon}
      admin={item.admin}
      isActive={location.pathname === item.to}
    />
  ));

  return (
    <header className="navbar" role="banner">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" aria-label="JobPortal home">
          Job<span>Portal</span>
        </Link>

        <nav className="navbar__nav" aria-label="Main navigation">
          {linkList}
        </nav>

        <div className="navbar__actions">
          {authActions}
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <FaSun aria-hidden /> : <FaMoon aria-hidden />}
          </Button>
        </div>

        <button
          type="button"
          className="navbar__toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {menuOpen && (
        <div id="mobile-nav" className="navbar__mobile-panel">
          <nav aria-label="Mobile navigation">{linkList}</nav>
          <div className="navbar__actions">{authActions}</div>
          <div style={{ padding: "var(--space-4) 0" }}>
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="btn--block"
            >
              {isDark ? <FaSun aria-hidden /> : <FaMoon aria-hidden />}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
