import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import toast from "react-hot-toast";
import API from "../services/api";
import { useAuth } from "../hooks/useAuth";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";

export default function Login() {
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
      setUser(res.data.user, res.data.token);
      toast.success("Welcome back!");
      navigate("/");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page--auth">
      <div className="auth-card">
        <h1 className="auth-card__title">Welcome back</h1>
        <p className="auth-card__subtitle">
          Sign in to continue your career journey.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <InputField
            label="Email"
            type="email"
            name="email"
            icon={FaEnvelope}
            placeholder="you@email.com"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            icon={FaLock}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
          <Button type="submit" block size="lg" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div className="auth-card__footer">
          <span>Don&apos;t have an account?</span>
          <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}
