import { useState } from "react";

import {

  Link,

  useNavigate

} from "react-router-dom";

import {

  FaSearch,
  FaBriefcase,
  FaUsers,
  FaBuilding

} from "react-icons/fa";

import "../assets/styles/home.css";

export default function Home() {

  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  // SEARCH FUNCTION
  const handleSearch = () => {

    if (!search.trim()) {

      return;
    }

    navigate(

      `/jobs?search=${search}`
    );
  };

  // CATEGORY FUNCTION
  const handleCategory = (category) => {

    navigate(

      `/jobs?category=${category}`
    );
  };

  return (

    <div className="home">

      {/* HERO SECTION */}
      <section className="hero-section">

        <div className="hero-content">

          <h1>

            Find Your Dream Job

            <span>

              {" "}Faster 🚀

            </span>

          </h1>

          <p>

            Apply to jobs, track applications,
            connect with recruiters,
            and grow your career —
            all in one professional platform.

          </p>

          {/* SEARCH BAR */}
          <div className="search-box">

            <FaSearch className="search-icon" />

            <input
              type="text"
              placeholder="Search jobs, companies, skills..."
              value={search}
              onChange={(e)=>

                setSearch(e.target.value)
              }
            />

            <button onClick={handleSearch}>

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

          <h2>

            5K+

          </h2>

          <p>

            Active Jobs

          </p>

        </div>

        <div className="stat-card">

          <FaUsers className="stat-icon purple" />

          <h2>

            10K+

          </h2>

          <p>

            Job Seekers

          </p>

        </div>

        <div className="stat-card">

          <FaBuilding className="stat-icon orange" />

          <h2>

            500+

          </h2>

          <p>

            Companies

          </p>

        </div>

      </section>

      {/* CATEGORIES */}
      <section className="categories-section">

        <h2>

          Popular Categories

        </h2>

        <div className="categories-grid">

          <div
            className="category-card"
            onClick={()=>

              handleCategory(
                "Technology"
              )
            }
          >

            💻 Technology

          </div>

          <div
            className="category-card"
            onClick={()=>

              handleCategory(
                "Finance"
              )
            }
          >

            💰 Finance

          </div>

          <div
            className="category-card"
            onClick={()=>

              handleCategory(
                "Healthcare"
              )
            }
          >

            🏥 Healthcare

          </div>

          <div
            className="category-card"
            onClick={()=>

              handleCategory(
                "Marketing"
              )
            }
          >

            📈 Marketing

          </div>

          <div
            className="category-card"
            onClick={()=>

              handleCategory(
                "Design"
              )
            }
          >

            🎨 Design

          </div>

          <div
            className="category-card"
            onClick={()=>

              handleCategory(
                "Cyber Security"
              )
            }
          >

            🛡 Cyber Security

          </div>

        </div>

      </section>

    </div>
  );
}