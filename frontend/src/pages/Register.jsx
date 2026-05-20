import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import API from "../services/api";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaBuilding
} from "react-icons/fa";

import "../assets/styles/login.css";

export default function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({

    name: "",
    email: "",
    password: "",
    role: "jobseeker",
    companyName: ""

  });

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await API.post(

        "/auth/register",

        formData
      );

      alert("Registration Successful");

      navigate("/login");

    } catch (error) {

      console.log(error);

      alert("Registration Failed");
    }
  };

  return (

    <div className="login-page">

      <div className="login-card">

        <h1>Create Account</h1>

        <p className="login-subtitle">

          Start your journey with JobPortal.

        </p>

        <form onSubmit={handleSubmit}>

          {/* NAME */}
          <div className="input-box">

            <FaUser className="input-icon" />

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

          </div>

          {/* EMAIL */}
          <div className="input-box">

            <FaEnvelope className="input-icon" />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>

          {/* PASSWORD */}
          <div className="input-box">

            <FaLock className="input-icon" />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

          </div>

          {/* ROLE */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="role-select"
          >

            <option value="jobseeker">

              Job Seeker

            </option>

            <option value="recruiter">

              Recruiter

            </option>

          </select>

          {/* COMPANY */}
          {formData.role === "recruiter" && (

            <div className="input-box">

              <FaBuilding className="input-icon" />

              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                required
              />

            </div>

          )}

          <button type="submit">

            Register

          </button>

        </form>

        <div className="login-footer">

          <p>Already have an account?</p>

          <Link to="/login">

            Login

          </Link>

        </div>

      </div>

    </div>
  );
}