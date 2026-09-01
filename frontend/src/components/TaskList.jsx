const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDate(isoDate) {
  const [, month, day] = isoDate.split("-").map(Number);
  return `${MONTHS[month - 1]} ${day}`;
}

export default function TaskList({ tasks }) {
  if (!tasks?.length) return <p>No tasks yet.</p>;

  return (
    <ol className="task-list">
      {tasks.map((t) => (
        <li key={t.id}>
          <div className="task-title">{t.title}</div>
          <p className="task-description">{t.description}</p>
          <div className="task-meta">
            {t.start_date && t.end_date && (
              <span className="task-dates">
                {t.start_date === t.end_date
                  ? formatDate(t.start_date)
                  : `${formatDate(t.start_date)} – ${formatDate(t.end_date)}`}
              </span>
            )}
            {t.estimated_cost_usd != null && (
              <span className="task-cost">
                ~${t.estimated_cost_usd.toLocaleString()}
              </span>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
