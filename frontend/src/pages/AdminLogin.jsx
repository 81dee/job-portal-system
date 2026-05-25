import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaUserShield } from "react-icons/fa";
import toast from "react-hot-toast";
import API from "../services/api";
import { useAuth } from "../hooks/useAuth";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", formData);
      if (!res.data.success || res.data.user.role !== "admin") {
        toast.error("Not an admin account");
        return;
      }
      setUser(res.data.user, res.data.token);
      toast.success("Admin access granted");
      navigate("/admin");
    } catch {
      toast.error("Login failed");
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
          Admin login
        </h1>
        <p className="auth-card__subtitle" style={{ textAlign: "center" }}>
          Secure access for recruiter approvals.
        </p>

        <form onSubmit={handleSubmit}>
          <InputField
            label="Admin email"
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
            {loading ? "Signing in…" : "Login as admin"}
          </Button>
        </form>

        <div className="auth-card__footer">
          <span>No admin account?</span>
          <Link to="/admin-register">Register admin</Link>
        </div>
      </div>
    </div>
  );
}
