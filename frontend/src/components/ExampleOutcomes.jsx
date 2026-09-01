function DeckIcon() {
  return (
    <svg viewBox="0 0 200 160" className="example-illustration" role="img" aria-label="Deck or patio example">
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
    <svg viewBox="0 0 200 160" className="example-illustration" role="img" aria-label="Garden or landscaping example">
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
    <svg viewBox="0 0 200 160" className="example-illustration" role="img" aria-label="Room paint or refresh example">
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

function KitchenIcon() {
  return (
    <svg viewBox="0 0 200 160" className="example-illustration" role="img" aria-label="Kitchen example">
      <rect x="0" y="0" width="200" height="160" rx="16" fill="var(--accent-bg)" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={30 + i * 28} y="60" width="10" height="6" fill="var(--accent-2)" opacity="0.4" />
      ))}
      <rect x="30" y="90" width="140" height="12" rx="3" fill="var(--text-h)" opacity="0.85" />
      <rect x="30" y="102" width="140" height="34" rx="4" fill="var(--accent)" />
      <rect x="40" y="112" width="50" height="16" rx="3" fill="var(--card-bg)" opacity="0.5" />
      <rect x="110" y="112" width="50" height="16" rx="3" fill="var(--card-bg)" opacity="0.5" />
      <circle cx="87" cy="120" r="2.5" fill="var(--text-h)" />
      <circle cx="113" cy="120" r="2.5" fill="var(--text-h)" />
    </svg>
  );
}

function BathroomIcon() {
  return (
    <svg viewBox="0 0 200 160" className="example-illustration" role="img" aria-label="Bathroom example">
      <rect x="0" y="0" width="200" height="160" rx="16" fill="var(--accent-bg)" />
      <rect x="30" y="70" width="140" height="50" rx="20" fill="var(--card-bg)" stroke="var(--accent)" strokeWidth="4" />
      <rect x="26" y="112" width="10" height="14" rx="3" fill="var(--border)" />
      <rect x="164" y="112" width="10" height="14" rx="3" fill="var(--border)" />
      <g transform="translate(150,68)">
        <rect x="-4" y="-16" width="8" height="16" rx="3" fill="var(--text-h)" />
        <rect x="-10" y="-20" width="20" height="6" rx="3" fill="var(--text-h)" />
      </g>
    </svg>
  );
}

function StorageIcon() {
  return (
    <svg viewBox="0 0 200 160" className="example-illustration" role="img" aria-label="Storage or shed example">
      <rect x="0" y="0" width="200" height="160" rx="16" fill="var(--accent-bg)" />
      <polygon points="60,68 100,38 140,68" fill="var(--accent)" />
      <rect x="65" y="68" width="70" height="60" rx="4" fill="var(--card-bg)" stroke="var(--border)" strokeWidth="2" />
      <rect x="90" y="96" width="20" height="32" rx="2" fill="var(--accent)" />
      <circle cx="105" cy="112" r="2.5" fill="var(--text-h)" />
    </svg>
  );
}

const CATEGORIES = [
  { key: "deck", label: "Deck & Patio", Icon: DeckIcon, keywords: ["deck", "patio", "porch"] },
  { key: "garden", label: "Garden & Landscaping", Icon: GardenIcon, keywords: ["garden", "yard", "landscap", "plant", "flower", "lawn"] },
  { key: "paint", label: "Room Refresh", Icon: PaintIcon, keywords: ["paint", "room", "refresh", "wall", "interior", "bedroom", "living room"] },
  { key: "kitchen", label: "Kitchen", Icon: KitchenIcon, keywords: ["kitchen", "cabinet", "countertop", "backsplash"] },
  { key: "bathroom", label: "Bathroom", Icon: BathroomIcon, keywords: ["bathroom", "bath", "shower", "tile", "vanity"] },
  { key: "storage", label: "Storage & Shed", Icon: StorageIcon, keywords: ["shed", "storage", "garage", "shelving", "closet"] },
];

function pickCategories(text) {
  const lower = text.toLowerCase();
  const matched = CATEGORIES.filter((c) => c.keywords.some((k) => lower.includes(k)));
  if (matched.length > 0) return matched.slice(0, 3);
  return [CATEGORIES[0], CATEGORIES[1], CATEGORIES[2]];
}

export default function ExampleOutcomes({ name, description, images = [] }) {
  const hasRealPhotos = images.length > 0;
  const categories = hasRealPhotos ? [] : pickCategories(`${name || ""} ${description || ""}`);

  return (
    <section className="example-outcomes">
      <h2>Example outcomes</h2>
      <p className="example-outcomes-note">
        {hasRealPhotos
          ? "Real photos of similar projects, found via Openverse — not photos of your specific plan."
          : "Illustrative examples of similar projects — not photos of your specific plan."}
      </p>
      <div className="example-gallery">
        {hasRealPhotos
          ? images.map((img) => (
              <a
                className="example-card example-photo-card"
                key={img.id}
                href={img.source_url || img.url}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={img.thumbnail_url || img.url}
                  alt={img.title || "Example project photo"}
                  className="example-illustration"
                  loading="lazy"
                />
                <span className="example-label">
                  {img.title || "Example"}
                  {img.creator && <span className="example-credit"> — {img.creator}</span>}
                </span>
              </a>
            ))
          : categories.map(({ key, label, Icon }) => (
              <div className="example-card" key={key}>
                <Icon />
                <span className="example-label">{label}</span>
              </div>
            ))}
      </div>
    </section>
  );
}
