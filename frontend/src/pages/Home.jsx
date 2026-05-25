import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBriefcase,
  FaUsers,
  FaBuilding,
} from "react-icons/fa";
import SearchBar from "../components/ui/SearchBar";
import StatCard from "../components/ui/StatCard";

const CATEGORIES = [
  { label: "Technology", emoji: "💻" },
  { label: "Finance", emoji: "💰" },
  { label: "Healthcare", emoji: "🏥" },
  { label: "Marketing", emoji: "📈" },
  { label: "Design", emoji: "🎨" },
  { label: "Cyber Security", emoji: "🛡" },
];

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if (!search.trim()) return;
    navigate(`/jobs?search=${encodeURIComponent(search)}`);
  };

  return (
    <div>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__inner">
          <h1 id="hero-title" className="hero__title animate-in">
            Find your dream job <span>faster</span>
          </h1>
          <p className="hero__subtitle animate-in animate-in-delay-1">
            Apply to roles, track applications, and connect with recruiters —
            all in one professional platform built for modern careers.
          </p>

          <div className="animate-in animate-in-delay-2" style={{ maxWidth: 640, margin: "0 auto" }}>
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSubmit={handleSearch}
              placeholder="Search jobs, companies, skills…"
            />
          </div>

          <div className="hero__actions animate-in animate-in-delay-3">
            <Link to="/jobs" className="btn btn--primary btn--lg">
              Browse jobs
            </Link>
            <Link to="/login" className="btn btn--secondary btn--lg">
              Sign in
            </Link>
            <Link to="/register" className="btn btn--ghost btn--lg" style={{ color: "white" }}>
              Create account
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--muted" aria-label="Platform statistics">
        <div className="page">
          <div className="grid-stats">
            <StatCard icon={FaBriefcase} value="5K+" label="Active jobs" tone="primary" />
            <StatCard icon={FaUsers} value="10K+" label="Job seekers" tone="accent" />
            <StatCard icon={FaBuilding} value="500+" label="Companies" tone="warning" />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="categories-title">
        <div className="page">
          <h2 id="categories-title" className="section__title">
            Popular categories
          </h2>
          <div className="category-grid">
            {CATEGORIES.map(({ label, emoji }) => (
              <button
                key={label}
                type="button"
                className="category-tile"
                onClick={() =>
                  navigate(`/jobs?category=${encodeURIComponent(label)}`)
                }
              >
                {emoji} {label}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
