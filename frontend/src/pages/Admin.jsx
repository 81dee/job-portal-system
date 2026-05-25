import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaCheckCircle, FaBuilding } from "react-icons/fa";
import toast from "react-hot-toast";
import API from "../services/api";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";

export default function Admin() {
  const navigate = useNavigate();
  const [recruiters, setRecruiters] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") navigate("/admin-login");
  }, [navigate]);

  const fetchRecruiters = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/admin/pending-recruiters", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecruiters(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/admin/pending-recruiters", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (active) setRecruiters(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.log(error);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const approveRecruiter = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.put(`/admin/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Recruiter approved");
      fetchRecruiters();
    } catch {
      toast.error("Approval failed");
    }
  };

  return (
    <div className="page page--dashboard">
      <PageHeader
        eyebrow="Administration"
        title="Admin dashboard"
        subtitle="Review and approve recruiter registrations."
      />

      <div className="grid-stats" style={{ marginBottom: "var(--space-10)" }}>
        <StatCard
          icon={FaUsers}
          value={recruiters.length}
          label="Pending recruiters"
          tone="primary"
        />
        <StatCard
          icon={FaBuilding}
          value={recruiters.length}
          label="Companies waiting"
          tone="accent"
        />
      </div>

      <h2 style={{ marginBottom: "var(--space-6)", fontSize: "var(--text-xl)" }}>
        Pending recruiter requests
      </h2>

      {recruiters.length > 0 ? (
        <div className="grid-cards">
          {recruiters.map((recruiter) => (
            <article key={recruiter._id} className="card admin-approval-card">
              <div className="admin-approval-card__top">
                <div>
                  <h3>{recruiter.name}</h3>
                  <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>
                    {recruiter.email}
                  </p>
                </div>
                <Badge variant="neutral">Recruiter</Badge>
              </div>
              <div className="admin-approval-card__company">
                <FaBuilding aria-hidden />
                <span>{recruiter.companyName || "—"}</span>
              </div>
              <Button onClick={() => approveRecruiter(recruiter._id)}>
                <FaCheckCircle aria-hidden /> Approve recruiter
              </Button>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="No pending recruiters" description="All recruiter requests are processed." />
      )}
    </div>
  );
}
