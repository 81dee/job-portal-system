import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import {
  FaEnvelope,
  FaLock,
  FaUserShield
} from "react-icons/fa";

import API from "../services/api";

import "../assets/styles/login.css";

export default function AdminLogin() {

  const navigate = useNavigate();

  // FORM STATE
  const [formData, setFormData] = useState({

    email: "",
    password: ""

  });

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value
    });
  };

  // HANDLE LOGIN
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post(

        "/auth/login",

        formData
      );

      // CHECK SUCCESS
      if (!res.data.success) {

        alert(
          res.data.message
        );

        return;
      }

      // CHECK ADMIN
      if (
        res.data.user.role !== "admin"
      ) {

        alert("Not an admin");

        return;
      }

      // SAVE TOKEN
      localStorage.setItem(

        "token",

        res.data.token
      );

      // SAVE USER
      localStorage.setItem(

        "user",

        JSON.stringify(
          res.data.user
        )
      );

      alert("Admin Login Successful");

      navigate("/admin");

    } catch (err) {

      console.log(err);

      alert("Login failed");
    }
  };

  return (

    <div className="login-page">

      <div className="login-card">

        {/* ICON */}
        <div className="admin-icon">

          <FaUserShield />

        </div>

        {/* TITLE */}
        <h1>

          Admin Login

        </h1>

        <p className="login-subtitle">

          Secure admin access for recruiter approvals.

        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit}>

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

          {/* BUTTON */}
          <button type="submit">

            Login as Admin

          </button>

        </form>

        {/* FOOTER */}
        <div className="login-footer">

          <p>

            No admin account?

          </p>

          <Link to="/admin-register">

            Register Admin

          </Link>

        </div>

      </div>

    </div>
  );
}