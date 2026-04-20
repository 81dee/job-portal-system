import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/jobs";
import Navbar from "./components/Navbar";
import Recruiter from "./pages/Recruiter";
import Layout from "./components/Layout";


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />       {/* default */}
        <Route path="/login" element={<Login />} />  
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Layout> <Dashboard /> </Layout>} />
        <Route path="/jobs" element={<Layout> <Jobs /> </Layout>} />
        <Route path="/recruiter" element={<Layout> <Recruiter /> </Layout>} />
      </Routes>
    </BrowserRouter>
  );
}