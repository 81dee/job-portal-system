import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import {
  FaUserShield,
  FaEnvelope,
  FaLock,
  FaUser
} from "react-icons/fa";

import API from "../services/api";

import "../assets/styles/login.css";

export default function AdminRegister() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({

    name: "",
    email: "",
    password: ""

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

        {
          ...formData,
          role: "admin",
          isApproved: true
        }
      );

      alert("Admin Registered Successfully");

      navigate("/admin-login");

    } catch (error) {

      console.log(error);

      alert("Admin Registration Failed");
    }
  };

  return (

    <div className="login-page">

      <div className="login-card">

        <div className="admin-icon">

          <FaUserShield />

        </div>

        <h1>Create Admin</h1>

        <p className="login-subtitle">

          Register secure admin account.

        </p>

        <form onSubmit={handleSubmit}>

          {/* NAME */}
          <div className="input-box">

            <FaUser className="input-icon" />

            <input
              type="text"
              name="name"
              placeholder="Admin Name"
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
              placeholder="Admin Email"
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

          <button type="submit">

            Register Admin

          </button>

        </form>

        <div className="login-footer">

          <p>Already have admin account?</p>

          <Link to="/admin-login">

            Login

          </Link>

        </div>

      </div>

    </div>
  );
}