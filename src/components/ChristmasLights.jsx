/** A draped string of warm bulbs that twinkle softly. */
const COLORS = ['#e9c98f', '#d8b8b5', '#f3dfb8', '#c5a46d', '#e8b4a8'];

export default function ChristmasLights({ count = 11, className = '' }) {
  const bulbs = Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const x = 4 + t * 392;
    const y = 10 + Math.sin(t * Math.PI * 2) * 6 + Math.sin(t * Math.PI) * 18;
    return { x, y, c: COLORS[i % COLORS.length], delay: (i * 0.37) % 2.6 };
  });
  return (
    <svg className={`lights ${className}`} viewBox="0 0 400 48" preserveAspectRatio="none" aria-hidden="true">
      <path
        d={`M0 8 ${bulbs.map((b) => `L${b.x} ${b.y - 4}`).join(' ')} L400 8`}
        fill="none"
        stroke="rgba(120,90,70,.55)"
        strokeWidth="1"
      />
      {bulbs.map((b, i) => (
        <g key={i} transform={`translate(${b.x} ${b.y})`}>
          <rect x="-1.6" y="-5" width="3.2" height="3.4" rx=".6" fill="#7a6250" />
          <circle r="9" fill={b.c} opacity=".18" className="lights__halo" style={{ animationDelay: `${b.delay}s` }} />
          <ellipse rx="2.8" ry="4" cy="1.5" fill={b.c} className="lights__bulb" style={{ animationDelay: `${b.delay}s` }} />
        </g>
      ))}
    </svg>
  );
}
