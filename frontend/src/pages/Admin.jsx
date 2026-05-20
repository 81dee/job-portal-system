import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../services/api";

import {
  FaUsers,
  FaCheckCircle,
  FaBuilding,
  FaUserShield
} from "react-icons/fa";

import "../assets/styles/admin.css";

export default function Admin() {

  const navigate = useNavigate();

  const [recruiters, setRecruiters] = useState([]);

  // PROTECT ADMIN PAGE
  useEffect(() => {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user || user.role !== "admin") {

      navigate("/admin-login");
    }

  }, [navigate]);

  // FETCH PENDING RECRUITERS
  const fetchRecruiters = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await API.get(

        "/admin/pending-recruiters",

        {
          headers: {

            Authorization: `Bearer ${token}`
          }
        }
      );

      setRecruiters(res.data);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchRecruiters();

  }, []);

  // APPROVE RECRUITER
  const approveRecruiter = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await API.put(

        `/admin/approve/${id}`,

        {},

        {
          headers: {

            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Recruiter Approved");

      fetchRecruiters();

    } catch (error) {

      console.log(error);

      alert("Approval Failed");
    }
  };

  return (

    <div className="admin-page">

      {/* HEADER */}
      <div className="admin-header">

        <h1>

          <FaUserShield />

          Admin Dashboard

        </h1>

        <p>
          Approve recruiters and manage companies
        </p>

      </div>

      {/* STATS */}
      <div className="admin-stats">

        <div className="admin-stat-card">

          <FaUsers className="stat-icon blue" />

          <div>

            <h2>
              {recruiters.length}
            </h2>

            <p>
              Pending Recruiters
            </p>

          </div>

        </div>

        <div className="admin-stat-card">

          <FaBuilding className="stat-icon purple" />

          <div>

            <h2>
              {recruiters.length}
            </h2>

            <p>
              Companies Waiting
            </p>

          </div>

        </div>

      </div>

      {/* APPROVALS */}
      <div className="approval-section">

        <h2>
          Pending Recruiter Requests
        </h2>

        <div className="approval-grid">

          {recruiters.length > 0 ? (

            recruiters.map((recruiter) => (

              <div
                className="approval-card"
                key={recruiter._id}
              >

                <div className="approval-top">

                  <div>

                    <h3>
                      {recruiter.name}
                    </h3>

                    <p>
                      {recruiter.email}
                    </p>

                  </div>

                  <span>
                    Recruiter
                  </span>

                </div>

                <div className="company-box">

                  <FaBuilding />

                  <span>
                    {recruiter.companyName}
                  </span>

                </div>

                <button
                  onClick={() =>
                    approveRecruiter(recruiter._id)
                  }
                >

                  <FaCheckCircle />

                  Approve Recruiter

                </button>

              </div>

            ))

          ) : (

            <div className="empty-box">

              <h3>
                No Pending Recruiters
              </h3>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}