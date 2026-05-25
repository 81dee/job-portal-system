import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaBuilding,
} from "react-icons/fa";
import toast from "react-hot-toast";
import API from "../services/api";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobseeker",
    companyName: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/register", formData);
      toast.success("Account created — please sign in");
      navigate("/login");
    } catch {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page--auth">
      <div className="auth-card">
        <h1 className="auth-card__title">Create account</h1>
        <p className="auth-card__subtitle">
          Join JobPortal as a seeker or recruiter.
        </p>

        <form onSubmit={handleSubmit}>
          <InputField
            label="Full name"
            type="text"
            name="name"
            icon={FaUser}
            value={formData.name}
            onChange={handleChange}
            required
          />
          <InputField
            label="Email"
            type="email"
            name="email"
            icon={FaEnvelope}
            value={formData.email}
            onChange={handleChange}
            required
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            icon={FaLock}
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="form-group">
            <label className="form-label" htmlFor="role">
              I am a
            </label>
            <select
              id="role"
              name="role"
              className="form-input"
              style={{ paddingLeft: "var(--space-4)", width: "100%" }}
              value={formData.role}
              onChange={handleChange}
            >
              <option value="jobseeker">Job seeker</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          {formData.role === "recruiter" && (
            <InputField
              label="Company name"
              type="text"
              name="companyName"
              icon={FaBuilding}
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          )}

          <Button type="submit" block size="lg" disabled={loading}>
            {loading ? "Creating…" : "Create account"}
          </Button>
        </form>

        <div className="auth-card__footer">
          <span>Already registered?</span>
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
