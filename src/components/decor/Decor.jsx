/* Hand-drawn-feeling SVG ornaments. All decorative → aria-hidden. */

export function Divider({ className = '', glyph = 'star' }) {
  return (
    <div className={`divider ${className}`} aria-hidden="true">
      <span className="divider__line" />
      {glyph === 'heart' ? (
        <svg width="14" height="12" viewBox="0 0 14 12">
          <path d="M7 11.2C5 9.5 1 7 1 4 1 2.3 2.3 1 4 1c1.2 0 2.3.7 3 1.7C7.7 1.7 8.8 1 10 1c1.7 0 3 1.3 3 3 0 3-4 5.5-6 7.2z" fill="currentColor" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14">
          <path d="M7 0l1.4 5.6L14 7l-5.6 1.4L7 14 5.6 8.4 0 7l5.6-1.4z" fill="currentColor" />
        </svg>
      )}
      <span className="divider__line" />
    </div>
  );
}

export function Star({ size = 16, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 1.5l2.3 7.2h7.5l-6.1 4.4 2.3 7.2L12 15.9l-6 4.4 2.3-7.2-6.1-4.4h7.5z" fill="currentColor" />
    </svg>
  );
}

export function Heart({ size = 16, className = '', filled = true }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 22" aria-hidden="true">
      <path
        d="M12 20.5C8.6 17.6 2 13.2 2 7.6 2 4.5 4.4 2 7.4 2c1.9 0 3.6 1 4.6 2.6C13 3 14.7 2 16.6 2 19.6 2 22 4.5 22 7.6c0 5.6-6.6 10-10 12.9z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.6}
      />
    </svg>
  );
}

export function PineBranch({ className = '', flip = false }) {
  // Stylised fir sprig: a stem with layered needles in muted greens + a gold berry cluster.
  const needles = [];
  for (let i = 0; i < 14; i++) {
    const x = 18 + i * 13;
    const len = 26 - Math.abs(i - 5) * 1.4;
    needles.push(
      <path key={`a${i}`} d={`M${x} 60 q 6 -${len * 0.6} ${len * 0.5} -${len}`} />,
      <path key={`b${i}`} d={`M${x} 60 q 6 ${len * 0.6} ${len * 0.5} ${len}`} />
    );
  }
  return (
    <svg
      className={`pine ${className}`}
      viewBox="0 0 220 120"
      aria-hidden="true"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <g fill="none" strokeLinecap="round">
        <path d="M4 62 C 70 58, 140 60, 214 52" stroke="#4a3328" strokeWidth="2.4" />
        <g stroke="#2f4a3a" strokeWidth="2">{needles}</g>
        <g stroke="#3d5d48" strokeWidth="1.4" opacity=".8" transform="translate(6 3)">{needles}</g>
      </g>
      <g>
        <circle cx="64" cy="70" r="5" fill="#6d2639" />
        <circle cx="74" cy="66" r="4" fill="#8a3048" />
        <circle cx="70" cy="76" r="3.4" fill="#c5a46d" />
      </g>
    </svg>
  );
}

export function Ornament({ className = '', color = 'var(--burgundy)', size = 44 }) {
  return (
    <svg className={className} width={size} height={size * 1.35} viewBox="0 0 40 54" aria-hidden="true">
      <defs>
        <radialGradient id="orn-shine" cx="35%" cy="35%" r="70%">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" />
          <stop offset=".35" stopColor="#fff" stopOpacity=".08" />
          <stop offset="1" stopColor="#000" stopOpacity=".25" />
        </radialGradient>
      </defs>
      <line x1="20" y1="0" x2="20" y2="10" stroke="var(--gold)" strokeWidth="1" />
      <rect x="15" y="9" width="10" height="6" rx="1.5" fill="var(--gold)" />
      <circle cx="20" cy="34" r="18" fill={color} />
      <circle cx="20" cy="34" r="18" fill="url(#orn-shine)" />
      <path d="M3 32 Q20 38 37 32" stroke="var(--gold-soft)" strokeWidth="1" fill="none" opacity=".7" />
    </svg>
  );
}

export function WaxSeal({ size = 56, className = '', initial = '♡' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 60 60" aria-hidden="true">
      <defs>
        <radialGradient id="seal-g" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#9a3a52" />
          <stop offset=".7" stopColor="#6d2639" />
          <stop offset="1" stopColor="#4a1a28" />
        </radialGradient>
      </defs>
      <path
        d="M30 2c4 0 5 3 8 4s6-1 8 2 0 6 2 8 5 3 5 7-3 5-3 8 3 5 1 8-5 2-7 4-2 6-5 7-5-1-9-1-6 3-9 1-2-5-4-7-6-2-7-5 2-6 1-9-4-4-3-8 4-4 5-7-1-6 2-8 6 0 8-2 2-6 5-6 6 0 4 0z"
        fill="url(#seal-g)"
      />
      <circle cx="30" cy="30" r="17" fill="none" stroke="rgba(0,0,0,.25)" strokeWidth="1.5" />
      <circle cx="30" cy="30" r="15.5" fill="none" stroke="rgba(255,220,200,.15)" strokeWidth="1" />
      <text x="30" y="37" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="20" fill="#e8c4c4" opacity=".85">
        {initial}
      </text>
    </svg>
  );
}

export function GiftBox({ className = '', size = 120 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <linearGradient id="box-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7e2c43" />
          <stop offset="1" stopColor="#4c1c2c" />
        </linearGradient>
        <linearGradient id="rib-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b8945c" />
          <stop offset=".5" stopColor="#e6cf9f" />
          <stop offset="1" stopColor="#b8945c" />
        </linearGradient>
      </defs>
      <g className="giftbox__body">
        <rect x="18" y="52" width="84" height="60" rx="3" fill="url(#box-g)" />
        <rect x="54" y="52" width="12" height="60" fill="url(#rib-g)" />
      </g>
      <g className="giftbox__lid">
        <rect x="12" y="38" width="96" height="18" rx="3" fill="#86304a" />
        <rect x="54" y="38" width="12" height="18" fill="url(#rib-g)" />
        <path d="M60 38 C 44 20, 30 30, 42 38 Z" fill="none" stroke="url(#rib-g)" strokeWidth="5" strokeLinejoin="round" />
        <path d="M60 38 C 76 20, 90 30, 78 38 Z" fill="none" stroke="url(#rib-g)" strokeWidth="5" strokeLinejoin="round" />
        <circle cx="60" cy="38" r="4.5" fill="#e6cf9f" />
      </g>
    </svg>
  );
}
