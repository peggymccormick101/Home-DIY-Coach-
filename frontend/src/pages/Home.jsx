import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectForm from "../components/ProjectForm.jsx";
import HeroIllustration from "../components/HeroIllustration.jsx";
import { createProject, deleteProject, listProjects } from "../api.js";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    listProjects()
      .then(setProjects)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(data) {
    setSubmitting(true);
    setError(null);
    try {
      const project = await createProject(data);
      navigate(`/projects/${project.id}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(e, project) {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Delete "${project.name}"? This can't be undone.`)) return;
    setDeletingId(project.id);
    setError(null);
    try {
      await deleteProject(project.id);
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-copy">
          <HeroIllustration />
          <h1 className="hero-tagline">Plan it. Build it. Love it.</h1>
          <p className="hero-subtext">
            Tell us your project idea, budget, and timeline — we'll turn it into a
            step-by-step plan, shopping list, and a coach you can ask questions.
          </p>
        </div>
        <ProjectForm onSubmit={handleCreate} submitting={submitting} />
      </div>
      {error && <p className="error">{error}</p>}

      <section className="project-list-section">
        <h2>Your projects</h2>
        {loading && <p>Loading...</p>}
        {!loading && projects.length === 0 && <p>No projects yet — create your first one above.</p>}
        <ul className="project-list">
          {projects.map((p) => (
            <li key={p.id}>
              <a
                className="project-link"
                href={`/projects/${p.id}`}
                onClick={(e) => { e.preventDefault(); navigate(`/projects/${p.id}`); }}
              >
                <span className="project-name">{p.name}</span>
                <span className="project-meta">
                  Budget ${p.budget_usd.toLocaleString()}
                  {p.estimated_total_cost_usd != null && ` · Est. $${p.estimated_total_cost_usd.toLocaleString()}`}
                  {p.target_date && ` · Due ${p.target_date}`}
                </span>
              </a>
              <button
                type="button"
                className="delete-button"
                onClick={(e) => handleDelete(e, p)}
                disabled={deletingId === p.id}
                aria-label={`Delete ${p.name}`}
              >
                {deletingId === p.id ? "Deleting…" : "Delete"}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
