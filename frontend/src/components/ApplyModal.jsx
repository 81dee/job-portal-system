import { useState } from "react";

import API from "../services/api";

import "../assets/styles/applyModal.css";

export default function ApplyModal({

  job,

  closeModal

}) {

  const [formData, setFormData] = useState({

    fullName: "",
    email: "",
    phone: "",
    qualification: "",
    experience: "",
    skills: "",
    currentCompany: "",
    expectedSalary: "",
    location: ""

  });

  const [resume, setResume] = useState(null);

  // HANDLE CHANGE
  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value
    });
  };

  // SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      const data = new FormData();

      // APPEND TEXT DATA
      Object.keys(formData).forEach((key) => {

        data.append(

          key,

          formData[key]
        );
      });

      // APPEND FILE
      data.append("resume", resume);

      await API.post(

        `/application/apply/${job._id}`,

        data,

        {

          headers: {

            Authorization: `Bearer ${token}`,

            "Content-Type":
              "multipart/form-data"
          }
        }
      );

      alert("Application submitted");

      closeModal();

    } catch (err) {

      console.log(err);

      alert(

        err?.response?.data?.message ||

        "Application failed"
      );
    }
  };

  return (

    <div className="apply-modal-overlay">

      <div className="apply-modal">

        <h2>

          Apply for {job.title}

        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="qualification"
            placeholder="Qualification"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="experience"
            placeholder="Experience"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="skills"
            placeholder="Skills"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="currentCompany"
            placeholder="Current Company"
            onChange={handleChange}
          />

          <input
            type="text"
            name="expectedSalary"
            placeholder="Expected Salary"
            onChange={handleChange}
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            onChange={handleChange}
          />

          {/* RESUME */}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) =>

              setResume(
                e.target.files[0]
              )
            }
            required
          />

          {/* BUTTONS */}
          <div className="apply-actions">

            <button type="submit">

              Submit Application

            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={closeModal}
            >

              Cancel

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}