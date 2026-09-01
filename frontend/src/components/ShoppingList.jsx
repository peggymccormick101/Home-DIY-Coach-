export default function ShoppingList({ materials }) {
  if (!materials?.length) return <p>No shopping list yet.</p>;

  const total = materials.reduce((sum, m) => sum + (m.estimated_cost_usd || 0), 0);

  return (
    <div>
      <table className="shopping-list">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Category</th>
            <th>Est. cost</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((m) => (
            <tr key={m.id}>
              <td>{m.name}</td>
              <td>{m.quantity}</td>
              <td>{m.category || "—"}</td>
              <td>{m.estimated_cost_usd != null ? `$${m.estimated_cost_usd.toLocaleString()}` : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="shopping-total">Estimated materials total: ${total.toLocaleString()}</p>
    </div>
  );
}
