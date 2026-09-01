import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectForm from "../components/ProjectForm.jsx";
import { createProject, listProjects } from "../api.js";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
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

  return (
    <div className="home-page">
      <ProjectForm onSubmit={handleCreate} submitting={submitting} />
      {error && <p className="error">{error}</p>}

      <section className="project-list-section">
        <h2>Your projects</h2>
        {loading && <p>Loading...</p>}
        {!loading && projects.length === 0 && <p>No projects yet — create your first one above.</p>}
        <ul className="project-list">
          {projects.map((p) => (
            <li key={p.id}>
              <a href={`/projects/${p.id}`} onClick={(e) => { e.preventDefault(); navigate(`/projects/${p.id}`); }}>
                <span className="project-name">{p.name}</span>
                <span className="project-meta">
                  Budget ${p.budget_usd.toLocaleString()}
                  {p.estimated_total_cost_usd != null && ` · Est. $${p.estimated_total_cost_usd.toLocaleString()}`}
                  {p.target_date && ` · Due ${p.target_date}`}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
