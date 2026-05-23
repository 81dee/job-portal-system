import { useEffect, useState } from "react";

import API from "../services/api";

import {
  FaBriefcase,
  FaCheckCircle,
  FaTimesCircle,
  FaClock
} from "react-icons/fa";

import "../assets/styles/dashboard.css";

export default function Dashboard() {

  const [applications, setApplications] = useState([]);

  const [stats, setStats] = useState({

    total: 0,
    accepted: 0,
    rejected: 0,
    pending: 0

  });

  // FETCH APPLICATIONS
  const fetchApplications = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await API.get(

        "/application/my",

        {
          headers: {

            Authorization: `Bearer ${token}`
          }
        }
      );

      setApplications(res.data);

      // STATS
      const total = res.data.length;

      const accepted = res.data.filter(

        app =>

          app.status === "accepted"
      ).length;

      const rejected = res.data.filter(

        app =>

          app.status === "rejected"
      ).length;

      const pending = res.data.filter(

        app =>

          app.status === "pending"
      ).length;

      setStats({

        total,
        accepted,
        rejected,
        pending
      });

    } catch (err) {

      console.log(err);
    }
  };

  useEffect(() => {

    fetchApplications();

  }, []);

  return (

    <div className="dashboard-page">

      {/* TOP STATS */}
      <div className="dashboard-stats">

        {/* TOTAL */}
        <div className="dashboard-stat-card">

          <FaBriefcase className="stat-icon" />

          <div>

            <h2>{stats.total}</h2>

            <p>Total Applied</p>

          </div>

        </div>

        {/* ACCEPTED */}
        <div className="dashboard-stat-card">

          <FaCheckCircle className="stat-icon accepted" />

          <div>

            <h2>{stats.accepted}</h2>

            <p>Accepted</p>

          </div>

        </div>

        {/* REJECTED */}
        <div className="dashboard-stat-card">

          <FaTimesCircle className="stat-icon rejected" />

          <div>

            <h2>{stats.rejected}</h2>

            <p>Rejected</p>

          </div>

        </div>

        {/* PENDING */}
        <div className="dashboard-stat-card">

          <FaClock className="stat-icon pending" />

          <div>

            <h2>{stats.pending}</h2>

            <p>Pending</p>

          </div>

        </div>

      </div>

      {/* APPLICATIONS */}
      <div className="dashboard-applications">

        <h1>My Applications</h1>

        <div className="applications-grid">

          {applications.map((app) => (

            <div
              className="application-card"
              key={app._id}
            >

              <h2>

                {app.job?.title}

              </h2>

              <p>

                {app.job?.companyName}

              </p>

              <span className={`status ${app.status}`}>

                {app.status}

              </span>

              <div className="application-info">

                <p>

                  <strong>Location:</strong>

                  {app.job?.location}

                </p>

                <p>

                  <strong>Salary:</strong>

                  ₹{app.job?.salary}

                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}