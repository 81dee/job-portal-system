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

import toast from "react-hot-toast";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import { openResume } from "../utils/uploads";

export default function RecruiterApplications() {

  const [applications, setApplications] = useState([]);

  const token = localStorage.getItem("token");

  const handleViewResume = async (app) => {
    try {
      await openResume(app);
    } catch (err) {
      toast.error(err.message || "Could not open resume");
    }
  };

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
    let active = true;
    (async () => {
      try {
        const res = await API.get("/application/recruiter", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!active) return;
        setApplications(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.log(error);
        if (active) setApplications([]);
      }
    })();
    return () => {
      active = false;
    };
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

      toast.success("Application updated");

      fetchApplications();

    } catch (error) {

      console.log(error);

      toast.error("Update failed");
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

    <div className="page page--dashboard">

      <PageHeader
        eyebrow="Hiring"
        title="Job applicants"
        subtitle="Review applications, schedule interviews, and update status."
      />

      {applications.length > 0 ? (

        <div className="grid-cards">

          {applications.map((app) => (

            <article
              className="card application-review-card"
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

                <button
                  type="button"
                  className="meeting-link"
                  style={{
                    display: "inline-block",
                    marginBottom: "var(--space-3)",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => handleViewResume(app)}
                >

                  View resume

                </button>
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
              <div className="application-review-card__actions">

                <Button
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
                  <FaCheck aria-hidden /> Accept
                </Button>

                <Button
                  variant="danger"
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
                  <FaTimes aria-hidden /> Reject
                </Button>

              </div>

              <Badge
                variant={
                  app.status === "accepted"
                    ? "success"
                    : app.status === "rejected"
                      ? "danger"
                      : "warning"
                }
              >
                {app.status}
              </Badge>

            </article>
          ))}

        </div>

      ) : (
        <EmptyState title="No applications yet" description="Applications will appear here when candidates apply." />
      )}

    </div>
  );
}