import { useState, useEffect, useRef } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import Button from "./ui/Button";

export default function ApplyModal({ job, closeModal }) {
  const dialogRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    qualification: "",
    experience: "",
    skills: "",
    currentCompany: "",
    expectedSalary: "",
    location: "",
  });
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [closeModal]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      data.append("resume", resume);

      await API.post(`/application/apply/${job._id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Application submitted");
      closeModal();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Application failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onClick={closeModal}
    >
      <div
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="apply-modal-title" className="modal__title">
          Apply for {job.title}
        </h2>

        <form onSubmit={handleSubmit}>
          {[
            ["fullName", "Full name", "text"],
            ["email", "Email", "email"],
            ["phone", "Phone", "tel"],
            ["qualification", "Qualification", "text"],
            ["experience", "Experience", "text"],
            ["skills", "Skills", "text"],
            ["currentCompany", "Current company", "text"],
            ["expectedSalary", "Expected salary", "text"],
            ["location", "Location", "text"],
          ].map(([name, placeholder, type]) => (
            <input
              key={name}
              className="form-input"
              style={{ display: "block", width: "100%", marginBottom: "var(--space-4)", padding: "0.75rem 1rem" }}
              type={type}
              name={name}
              placeholder={placeholder}
              onChange={handleChange}
              required={name !== "currentCompany" && name !== "expectedSalary"}
            />
          ))}

          <label className="form-label" htmlFor="resume">
            Resume (PDF, DOC)
          </label>
          <input
            id="resume"
            type="file"
            accept=".pdf,.doc,.docx"
            className="form-input"
            style={{ padding: "var(--space-3)", width: "100%" }}
            onChange={(e) => setResume(e.target.files[0])}
            required
          />

          <div className="modal__actions">
            <Button type="submit" disabled={loading} block>
              {loading ? "Submitting…" : "Submit application"}
            </Button>
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
