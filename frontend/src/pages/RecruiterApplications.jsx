import { useEffect, useState } from "react";

import API from "../services/api";

import {

  FaUser,
  FaEnvelope,
  FaCheck,
  FaTimes,
  FaBriefcase,
  FaCalendarAlt,
  FaLink

} from "react-icons/fa";

import "../assets/styles/recruiterApplications.css";

const UPLOADS_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "");

export default function RecruiterApplications() {

  const [applications, setApplications] = useState([]);

  const token = localStorage.getItem("token");

  // FETCH APPLICATIONS
  const fetchApplications = async () => {

    try {

      const res = await API.get(

        "/application/recruiter",

        {
          headers: {

            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("APPLICATION DATA:", res.data);

      if (Array.isArray(res.data)) {

        setApplications(res.data);

      } else {

        setApplications([]);
      }

    } catch (error) {

      console.log(error);

      setApplications([]);
    }
  };

  useEffect(() => {

    fetchApplications();

  }, [token]);

  // UPDATE STATUS
  const updateStatus = async (

    id,

    status,

    message,

    interviewDate,

    interviewLink

  ) => {

    try {

      await API.put(

        `/application/status/${id}`,

        {

          status,

          message,

          interviewDate,

          interviewLink
        },

        {

          headers: {

            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Application Updated");

      fetchApplications();

    } catch (error) {

      console.log(error);

      alert("Update failed");
    }
  };

  // HANDLE INPUT CHANGE
  const handleInputChange = ( id, field, value ) => {

    setApplications((prev) =>

      prev.map((app) =>

        app._id === id

          ? {

              ...app,

              [field]: value
            }

          : app
      )
    );
  };

  return (

    <div className="recruiter-applications-page">

      <h1>

        Job Applicants

      </h1>

      {applications.length > 0 ? (

        <div className="applications-grid">

          {applications.map((app) => (

            <div
              className="application-card"
              key={app._id}
            >

              {/* USER INFO */}
              <h2>

                <FaUser />

                {app.user?.name}

              </h2>

              <p>

                <FaEnvelope />

                {app.user?.email}

              </p>

              <p>

                <FaBriefcase />

                {app.job?.title}

              </p>

              {/* EXTRA DETAILS */}
              <div className="applicant-details">

                <p>

                  <strong>Phone:</strong>

                  {app.phone || "N/A"}

                </p>

                <p>

                  <strong>Qualification:</strong>

                  {app.qualification || "N/A"}

                </p>

                <p>

                  <strong>Experience:</strong>

                  {app.experience || "N/A"}

                </p>

                <p>

                  <strong>Skills:</strong>

                  {app.skills || "N/A"}

                </p>

              </div>

              {/* RESUME */}
              {app.resume && (

                <a

                  href={`${UPLOADS_BASE}/uploads/${app.resume}`}

                  target="_blank"

                  rel="noreferrer"

                  className="resume-btn"
                >

                  View Resume

                </a>
              )}

              {/* MESSAGE */}
              <textarea

                placeholder="Message to applicant"

                value={app.message || ""}

                onChange={(e) =>

                  handleInputChange(

                    app._id,

                    "message",

                    e.target.value
                  )
                }
              />

              {/* INTERVIEW DATE */}
              <div className="input-group">

                <FaCalendarAlt />

                <input

                  type="datetime-local"

                  value={app.interviewDate || ""}

                  onChange={(e) =>

                    handleInputChange(

                      app._id,

                      "interviewDate",

                      e.target.value
                    )
                  }
                />

              </div>

              {/* INTERVIEW LINK */}
              <div className="input-group">

                <FaLink />

                <input

                  type="text"

                  placeholder="Interview Link"

                  value={app.interviewLink || ""}

                  onChange={(e) =>

                    handleInputChange(

                      app._id,

                      "interviewLink",

                      e.target.value
                    )
                  }
                />

              </div>

              {/* STATUS */}
              <div className="status-buttons">

                <button
                  className="accept-btn"
                  onClick={() =>

                    updateStatus(

                      app._id,

                      "accepted",

                      app.message,

                      app.interviewDate,

                      app.interviewLink
                    )
                  }
                >

                  <FaCheck />

                  Accept

                </button>

                <button
                  className="reject-btn"
                  onClick={() =>

                    updateStatus(

                      app._id,

                      "rejected",

                      app.message,

                      app.interviewDate,

                      app.interviewLink
                    )
                  }
                >

                  <FaTimes />

                  Reject

                </button>

              </div>

              {/* CURRENT STATUS */}
              <div className="current-status">

                Status:

                <span>

                  {app.status}

                </span>

              </div>

            </div>
          ))}

        </div>

      ) : (

        <h2>

          No Applications Found

        </h2>
      )}

    </div>
  );
}