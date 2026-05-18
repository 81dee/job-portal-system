import {
  FaBriefcase,
  FaCheckCircle,
  FaTimesCircle,
  FaClock
} from "react-icons/fa";

import "../assets/styles/dashboard.css";

export default function Dashboard() {

  const applications = [

    {
      id: 1,
      title: "Frontend Developer",
      company: "Google",
      status: "Pending"
    },

    {
      id: 2,
      title: "Backend Developer",
      company: "Microsoft",
      status: "Accepted"
    },

    {
      id: 3,
      title: "UI/UX Designer",
      company: "Amazon",
      status: "Rejected"
    }

  ];

  return (

    <div className="dashboard-page">

      {/* HEADER */}
      <div className="dashboard-header">

        <h1>My Applications</h1>

        <p>
          Track all your job applications in one place.
        </p>

      </div>

      {/* STATS */}
      <div className="dashboard-stats">

        <div className="stat-box">

          <FaBriefcase className="blue" />

          <div>
            <h2>12</h2>
            <p>Total Applied</p>
          </div>

        </div>

        <div className="stat-box">

          <FaCheckCircle className="green" />

          <div>
            <h2>4</h2>
            <p>Accepted</p>
          </div>

        </div>

        <div className="stat-box">

          <FaClock className="orange" />

          <div>
            <h2>5</h2>
            <p>Pending</p>
          </div>

        </div>

        <div className="stat-box">

          <FaTimesCircle className="red" />

          <div>
            <h2>3</h2>
            <p>Rejected</p>
          </div>

        </div>

      </div>

      {/* APPLICATIONS */}
      <div className="applications-section">

        {applications.map((app) => (

          <div className="application-card" key={app.id}>

            <div className="application-left">

              <h2>{app.title}</h2>

              <p>{app.company}</p>

            </div>

            <div className="application-right">

              <span className={`status ${app.status.toLowerCase()}`}>

                {app.status}

              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}