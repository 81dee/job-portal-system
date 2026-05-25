import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUserShield, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import toast from "react-hot-toast";
import API from "../services/api";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";

export default function AdminRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/register", {
        ...formData,
        role: "admin",
        isApproved: true,
      });
      toast.success("Admin registered");
      navigate("/admin-login");
    } catch {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page--auth">
      <div className="auth-card">
        <div className="auth-card__icon-wrap" aria-hidden>
          <FaUserShield />
        </div>
        <h1 className="auth-card__title" style={{ textAlign: "center" }}>
          Create admin
        </h1>
        <p className="auth-card__subtitle" style={{ textAlign: "center" }}>
          Register a secure administrator account.
        </p>

        <form onSubmit={handleSubmit}>
          <InputField
            label="Name"
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
          <Button type="submit" block size="lg" disabled={loading}>
            {loading ? "Creating…" : "Register admin"}
          </Button>
        </form>

        <div className="auth-card__footer">
          <span>Already have access?</span>
          <Link to="/admin-login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
