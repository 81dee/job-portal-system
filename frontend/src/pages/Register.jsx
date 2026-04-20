import { useState } from "react";
import API from "../services/api";

export default function Register() {
  const [form, setForm] = useState({});

  const register = async () => {
    try {
      await API.post("/auth/register", form);
      alert("Registered");
    } catch (err) {
  console.log(err.response?.data);
  alert(err.response?.data?.error || "Error");
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <input placeholder="Name"
        onChange={(e)=>setForm({...form,name:e.target.value})} />

      <input placeholder="Email"
        onChange={(e)=>setForm({...form,email:e.target.value})} />

      <input placeholder="Password"
        onChange={(e)=>setForm({...form,password:e.target.value})} />

      <select onChange={(e)=>setForm({...form,role:e.target.value})}>
        <option value="">Select Role</option>
        <option value="recruiter">Recruiter</option>
        <option value="jobseeker">Jobseeker</option>
      </select>

      <button onClick={register}>Register</button>
    </div>
  );
}