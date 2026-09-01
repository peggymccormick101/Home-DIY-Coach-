import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import TaskList from "../components/TaskList.jsx";
import ShoppingList from "../components/ShoppingList.jsx";
import ChatBox from "../components/ChatBox.jsx";
import { askQuestion, deleteProject, getProject } from "../api.js";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [asking, setAsking] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getProject(id)
      .then(setProject)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleAsk(question) {
    setAsking(true);
    setProject((p) => ({
      ...p,
      messages: [...p.messages, { id: `tmp-${Date.now()}`, role: "user", content: question, created_at: new Date().toISOString() }],
    }));
    try {
      await askQuestion(id, question);
      const fresh = await getProject(id);
      setProject(fresh);
    } catch (e) {
      setError(e.message);
    } finally {
      setAsking(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${project.name}"? This can't be undone.`)) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteProject(id);
      navigate("/");
    } catch (e) {
      setError(e.message);
      setDeleting(false);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!project) return null;

  return (
    <div className="project-detail">
      <div className="project-detail-header">
        <Link to="/" className="back-link">
          ← All projects
        </Link>
        <button type="button" className="delete-button" onClick={handleDelete} disabled={deleting}>
          {deleting ? "Deleting…" : "Delete project"}
        </button>
      </div>
      <h1>{project.name}</h1>
      <p className="project-summary">{project.summary}</p>

      <div className="stat-row">
        <div className="stat">
          <span className="stat-label">Your budget</span>
          <span className="stat-value">${project.budget_usd.toLocaleString()}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Estimated cost</span>
          <span className="stat-value">
            {project.estimated_total_cost_usd != null ? `$${project.estimated_total_cost_usd.toLocaleString()}` : "—"}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Estimated duration</span>
          <span className="stat-value">
            {project.estimated_duration_days != null ? `${project.estimated_duration_days} days` : "—"}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Target date</span>
          <span className="stat-value">{project.target_date || "—"}</span>
        </div>
      </div>

      {project.budget_notes && (
        <div className="budget-notes">
          <strong>Budget notes:</strong> {project.budget_notes}
        </div>
      )}

      <section>
        <h2>Task plan</h2>
        <TaskList tasks={project.tasks} />
      </section>

      <section>
        <h2>Shopping list</h2>
        <ShoppingList materials={project.materials} />
      </section>

      <section>
        <h2>Ask your coach</h2>
        <ChatBox messages={project.messages} onAsk={handleAsk} asking={asking} />
      </section>
    </div>
  );
}
