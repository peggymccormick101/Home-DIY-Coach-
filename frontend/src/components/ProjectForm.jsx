import { useState } from "react";

export default function ProjectForm({ onSubmit, submitting }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [budgetUsd, setBudgetUsd] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [budgetError, setBudgetError] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !targetDate) return;

    const parsedBudget = Number(budgetUsd);
    if (budgetUsd.trim() === "" || !Number.isFinite(parsedBudget) || parsedBudget <= 0) {
      setBudgetError("Enter a budget greater than $0.");
      return;
    }
    setBudgetError(null);

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      budget_usd: parsedBudget,
      target_date: targetDate,
    });
  }

  return (
    <form className="project-form" onSubmit={handleSubmit}>
      <h2>Start a new project</h2>
      <label>
        Project idea
        <input
          type="text"
          placeholder="e.g. Build a backyard deck"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Tell us more
        <textarea
          placeholder="Size, location, style, materials you like, current condition, etc."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
        />
      </label>
      <div className="form-row">
        <label>
          Budget (USD)
          <input
            type="number"
            min="1"
            step="1"
            placeholder="1500"
            value={budgetUsd}
            onChange={(e) => {
              setBudgetUsd(e.target.value);
              setBudgetError(null);
            }}
            required
          />
          {budgetError && <span className="field-error">{budgetError}</span>}
        </label>
        <label>
          Target finish date
          <input
            type="date"
            value={targetDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setTargetDate(e.target.value)}
            required
          />
        </label>
      </div>
      <button type="submit" disabled={submitting}>
        {submitting ? "Generating your plan..." : "Generate my project plan"}
      </button>
    </form>
  );
}
