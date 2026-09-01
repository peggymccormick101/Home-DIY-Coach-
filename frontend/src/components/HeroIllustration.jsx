export default function HeroIllustration() {
  return (
    <svg viewBox="0 0 480 320" className="hero-illustration" role="img" aria-label="Illustration of a house with planning tools">
      <rect x="0" y="0" width="480" height="320" rx="24" fill="var(--accent-bg)" />
      <rect x="30" y="272" width="420" height="6" rx="3" fill="var(--border)" />

      {/* plant accent */}
      <g transform="translate(70,272)">
        <line x1="0" y1="0" x2="0" y2="-34" stroke="var(--accent-2)" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="-9" cy="-28" rx="11" ry="5.5" fill="var(--accent-2)" transform="rotate(-32 -9 -28)" />
        <ellipse cx="9" cy="-22" rx="11" ry="5.5" fill="var(--accent-2)" transform="rotate(32 9 -22)" />
        <ellipse cx="0" cy="-36" rx="8" ry="4.5" fill="var(--accent-2)" />
      </g>

      {/* house */}
      <g>
        <polygon points="115,150 185,85 255,150" fill="var(--accent)" />
        <rect x="127" y="150" width="106" height="112" rx="4" fill="var(--card-bg)" stroke="var(--border)" strokeWidth="2" />
        <rect x="163" y="197" width="34" height="65" rx="3" fill="var(--accent)" />
        <rect x="140" y="168" width="26" height="26" rx="3" fill="var(--accent-bg)" stroke="var(--accent)" strokeWidth="2" />
        <rect x="194" y="168" width="26" height="26" rx="3" fill="var(--accent-bg)" stroke="var(--accent)" strokeWidth="2" />
      </g>

      {/* wrench */}
      <g transform="translate(275,240) rotate(35)">
        <rect x="-6" y="-48" width="12" height="76" rx="6" fill="var(--text-h)" />
        <circle cx="0" cy="-52" r="15" fill="none" stroke="var(--text-h)" strokeWidth="10" />
        <circle cx="0" cy="32" r="10" fill="var(--text-h)" />
      </g>

      {/* clipboard */}
      <g>
        <rect x="332" y="112" width="86" height="118" rx="8" fill="var(--card-bg)" stroke="var(--border)" strokeWidth="2" />
        <rect x="355" y="103" width="40" height="16" rx="4" fill="var(--accent)" />
        <circle cx="349" cy="150" r="6" fill="none" stroke="var(--accent-2)" strokeWidth="3" />
        <path d="M346.5 150 l2 2.5 l4 -5" fill="none" stroke="var(--accent-2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="365" y1="150" x2="402" y2="150" stroke="var(--border)" strokeWidth="4" strokeLinecap="round" />
        <circle cx="349" cy="172" r="6" fill="none" stroke="var(--accent-2)" strokeWidth="3" />
        <path d="M346.5 172 l2 2.5 l4 -5" fill="none" stroke="var(--accent-2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="365" y1="172" x2="402" y2="172" stroke="var(--border)" strokeWidth="4" strokeLinecap="round" />
        <circle cx="349" cy="194" r="6" fill="var(--accent-bg)" stroke="var(--border)" strokeWidth="3" />
        <line x1="365" y1="194" x2="390" y2="194" stroke="var(--border)" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}
