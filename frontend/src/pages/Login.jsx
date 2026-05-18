import { useState } from "react";
import { useLocation } from "react-router-dom";

import API from "../services/api";

import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaBriefcase
} from "react-icons/fa";

import "../assets/styles/login.css";

export default function Login() {

  const location = useLocation();

  const [isRegister, setIsRegister] = useState(
   location.pathname === "/register"
 );

  const [formData, setFormData] = useState({

    name: "",
    email: "",
    password: "",
    role: "jobseeker"
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

      if(isRegister){

        await API.post("/auth/register", formData);

        alert("Registration Successful");

        setIsRegister(false);

      } else {

        await API.post("/auth/login", {

          email: formData.email,
          password: formData.password
        });

        alert("Login Successful");
      }

    } catch (error) {

      console.log(error);

      alert("Something went wrong");
    }
  };

  return (

    <div className="auth-page">

      <div className="auth-card">

        {/* LEFT */}
        <div className="auth-left">

          <h1>
            {isRegister ? "Create Account" : "Welcome Back"}
          </h1>

          <p>
            {isRegister
              ? "Join the platform and explore opportunities."
              : "Login and continue your career journey."
            }
          </p>

        </div>

        {/* RIGHT */}
        <div className="auth-right">

          <form onSubmit={handleSubmit}>

            {isRegister && (

              <div className="input-group">

                <FaUser />

                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>
            )}

            <div className="input-group">

              <FaEnvelope />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>

            <div className="input-group">

              <FaLock />

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
            {isRegister && (

              <div className="input-group">

                <FaBriefcase />

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >

                  <option value="jobseeker">
                    Job Seeker
                  </option>

                  <option value="recruiter">
                    Recruiter
                  </option>

                </select>

              </div>
            )}

            {/* BUTTON */}
            <button type="submit">

              {isRegister ? "Register" : "Login"}

            </button>

          </form>

          {/* SWITCH */}
          <div className="switch-auth">

            {isRegister ? (

              <p>
                Already have an account?

                <span onClick={() => setIsRegister(false)}>
                  Login
                </span>
              </p>

            ) : (

              <p>
                Don't have an account?

                <span onClick={() => setIsRegister(true)}>
                  Register
                </span>
              </p>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}