export default function TaskList({ tasks }) {
  if (!tasks?.length) return <p>No tasks yet.</p>;

  return (
    <ol className="task-list">
      {tasks.map((t) => (
        <li key={t.id}>
          <div className="task-title">{t.title}</div>
          <p className="task-description">{t.description}</p>
          {t.estimated_cost_usd != null && (
            <span className="task-cost">
              ~${t.estimated_cost_usd.toLocaleString()}
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
