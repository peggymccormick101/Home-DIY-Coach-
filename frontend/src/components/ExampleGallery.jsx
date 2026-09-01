const EXAMPLES = [
  { key: "deck", label: "Backyard Deck" },
  { key: "garden", label: "Garden Bed" },
  { key: "paint", label: "Room Refresh" },
];

function DeckIcon() {
  return (
    <svg viewBox="0 0 200 160" className="example-illustration" role="img" aria-label="Backyard deck illustration">
      <rect x="0" y="0" width="200" height="160" rx="16" fill="var(--accent-bg)" />
      <circle cx="164" cy="34" r="16" fill="var(--accent)" opacity="0.5" />
      <g transform="translate(30,60)">
        {[0, 20, 40, 60, 80, 100, 120].map((x) => (
          <rect key={x} x={x} y="0" width="14" height="70" rx="2" fill="var(--card-bg)" stroke="var(--border)" strokeWidth="2" />
        ))}
      </g>
      <rect x="24" y="52" width="146" height="8" rx="4" fill="var(--accent)" />
      <line x1="24" y1="140" x2="170" y2="140" stroke="var(--border)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function GardenIcon() {
  return (
    <svg viewBox="0 0 200 160" className="example-illustration" role="img" aria-label="Garden bed illustration">
      <rect x="0" y="0" width="200" height="160" rx="16" fill="var(--accent-bg)" />
      <rect x="30" y="88" width="140" height="46" rx="6" fill="var(--card-bg)" stroke="var(--accent)" strokeWidth="4" />
      <rect x="30" y="88" width="140" height="10" fill="var(--accent)" opacity="0.3" />
      {[55, 80, 105, 130, 150].map((x, i) => (
        <g key={x} transform={`translate(${x},${88 - (i % 2 === 0 ? 26 : 18)})`}>
          <line x1="0" y1="0" x2="0" y2="20" stroke="var(--accent-2)" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="-7" cy="4" rx="9" ry="4.5" fill="var(--accent-2)" transform="rotate(-30 -7 4)" />
          <ellipse cx="7" cy="8" rx="9" ry="4.5" fill="var(--accent-2)" transform="rotate(30 7 8)" />
        </g>
      ))}
    </svg>
  );
}

function PaintIcon() {
  return (
    <svg viewBox="0 0 200 160" className="example-illustration" role="img" aria-label="Room paint refresh illustration">
      <rect x="0" y="0" width="200" height="160" rx="16" fill="var(--accent-bg)" />
      <rect x="34" y="30" width="60" height="90" rx="6" fill="var(--card-bg)" stroke="var(--border)" strokeWidth="2" />
      <rect x="34" y="30" width="30" height="90" rx="6" fill="var(--accent)" opacity="0.85" />
      <g transform="translate(115,45) rotate(35)">
        <rect x="-10" y="0" width="20" height="34" rx="6" fill="var(--accent)" />
        <rect x="-4" y="30" width="8" height="46" rx="3" fill="var(--text-h)" />
      </g>
      <ellipse cx="150" cy="118" rx="20" ry="8" fill="var(--accent)" opacity="0.35" />
    </svg>
  );
}

const ICONS = { deck: DeckIcon, garden: GardenIcon, paint: PaintIcon };

export default function ExampleGallery() {
  return (
    <section className="example-gallery-section">
      <h2>Example projects</h2>
      <div className="example-gallery">
        {EXAMPLES.map(({ key, label }) => {
          const Icon = ICONS[key];
          return (
            <div className="example-card" key={key}>
              <Icon />
              <span className="example-label">{label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
