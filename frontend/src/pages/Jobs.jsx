import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";
import ApplyModal from "../components/ApplyModal";
import JobCard from "../components/JobCard";
import PageHeader from "../components/ui/PageHeader";
import SearchBar from "../components/ui/SearchBar";
import EmptyState from "../components/ui/EmptyState";

const CATEGORIES = [
  "All",
  "Technology",
  "Finance",
  "Healthcare",
  "Marketing",
  "Education",
  "Design",
  "Cyber Security",
  "AI/ML",
  "Data Science",
  "Law",
];

export default function Jobs() {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/job");
        setJobs(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <Loader label="Loading opportunities…" />;

  const searchText = search.toLowerCase();

  const filteredJobs = jobs
    .filter((job) => {
      const matchesSearch =
        job.title?.toLowerCase().includes(searchText) ||
        job.companyName?.toLowerCase().includes(searchText) ||
        job.category?.toLowerCase().includes(searchText) ||
        job.industry?.toLowerCase().includes(searchText) ||
        job.education?.toLowerCase().includes(searchText) ||
        job.skillsRequired?.join(" ").toLowerCase().includes(searchText);

      const matchesCategory =
        category === "All" || job.category === category;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const aExact = a.companyName?.toLowerCase().includes(searchText);
      const bExact = b.companyName?.toLowerCase().includes(searchText);
      return bExact - aExact;
    });

  return (
    <div className="page page--dashboard">
      <PageHeader
        center
        eyebrow="Opportunities"
        title="Available jobs"
        subtitle="Discover roles from top companies — filter by category or search skills."
      />

      <div style={{ maxWidth: 640, margin: "0 auto var(--space-8)" }}>
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSubmit={() => {}}
          showButton={false}
          placeholder="Search by title, company, skills…"
        />
      </div>

      <div className="chip-group" role="tablist" aria-label="Job categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={category === cat}
            className={`chip ${category === cat ? "chip--active" : ""}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredJobs.length > 0 ? (
        <div className="grid-cards">
          {filteredJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onApply={setSelectedJob}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No jobs match your filters"
          description="Try another category or broaden your search terms."
        />
      )}

      {selectedJob && (
        <ApplyModal
          job={selectedJob}
          closeModal={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}
