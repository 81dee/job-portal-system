import { useState } from "react";
import API from "../services/api";
import Loader from "../components/Loader";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      console.log("FULL RESPONSE:", res.data);
      localStorage.setItem("token", res.data.token);

      alert("Login success");
      window.location.href = "/dashboard";

    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message ||"Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        value={email}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        value={password}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={login}>Login</button>
    </div>
  );
}