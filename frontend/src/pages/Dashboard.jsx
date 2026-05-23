import { useEffect, useState } from "react";

import API from "../services/api";

import {

  FaBriefcase,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaBell,
  FaCalendarAlt,
  FaUser

} from "react-icons/fa";

import Notifications from "../components/Notifications";

import "../assets/styles/dashboard.css";

export default function Dashboard() {

  const [applications, setApplications] = useState([]);

  const [stats, setStats] = useState({

    total: 0,
    accepted: 0,
    rejected: 0,
    pending: 0

  });

  const token = localStorage.getItem("token");

  const user = JSON.parse(

    localStorage.getItem("user")
  );

  // FETCH APPLICATIONS
  const fetchApplications = async () => {

    try {

      const res = await API.get(

        "/application/my",

        {
          headers: {

            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = Array.isArray(res.data)

        ? res.data

        : [];

      setApplications(data);

    } catch (error) {

      console.log(error);
    }
  };

  // FETCH STATS
  const fetchStats = async () => {

    try {

      const res = await API.get(

        "/application/jobseeker-stats",

        {
          headers: {

            Authorization: `Bearer ${token}`
          }
        }
      );

      setStats(res.data);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchApplications();

    fetchStats();

  }, []);

  return (

    <div className="dashboard-page">

      {/* PROFILE */}
      <div className="profile-card">

        <FaUser className="profile-icon" />

        <div>

          <h2>

            {user?.name}

          </h2>

          <p>

            {user?.email}

          </p>

          <span>

            Jobseeker
          </span>

        </div>

      </div>

      {/* STATS */}
      <div className="dashboard-stats">

        <div className="stat-card">

          <FaBriefcase />

          <div>

            <h2>{stats.total}</h2>

            <p>Total Applied</p>

          </div>

        </div>

        <div className="stat-card accepted">

          <FaCheckCircle />

          <div>

            <h2>{stats.accepted}</h2>

            <p>Accepted</p>

          </div>

        </div>

        <div className="stat-card rejected">

          <FaTimesCircle />

          <div>

            <h2>{stats.rejected}</h2>

            <p>Rejected</p>

          </div>

        </div>

        <div className="stat-card pending">

          <FaClock />

          <div>

            <h2>{stats.pending}</h2>

            <p>Pending</p>

          </div>

        </div>

      </div>

      {/* APPLICATIONS */}
      <div className="applications-section">

        <h1>

          My Applications

        </h1>

        {applications.length > 0 ? (

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

                {/* STATUS */}
                <span className={`status ${app.status}`}>

                  {app.status}

                </span>

                {/* MESSAGE */}
                {app.message && (

                  <div className="message-box">

                    <FaBell />

                    <p>

                      {app.message}

                    </p>

                  </div>
                )}

                {/* INTERVIEW */}
                {app.interviewDate && (

                  <div className="interview-box">

                    <FaCalendarAlt />

                    <div>

                      <p>

                        Interview Scheduled

                      </p>

                      <span>

                        {new Date(

                          app.interviewDate

                        ).toLocaleString()}

                      </span>

                    </div>

                  </div>
                )}

                {/* INTERVIEW LINK */}
                {app.interviewLink && (

                  <a

                    href={app.interviewLink}

                    target="_blank"

                    rel="noreferrer"

                    className="meeting-link"
                  >

                    Join Interview

                  </a>
                )}

              </div>
            ))}

          </div>

        ) : (

          <div className="empty-state">

            <h2>

              No Applications Yet

            </h2>

          </div>
        )}

      </div>
       
       <Notifications />

    </div>
  );
}