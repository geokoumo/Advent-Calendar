export default function ProgressBar({ value, max, label }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="progress">
      <div className="progress__track" role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-label={label}>
        <div className="progress__fill" style={{ transform: `scaleX(${pct / 100})` }} />
        {Array.from({ length: max - 1 }, (_, i) => (
          <span key={i} className="progress__tick" style={{ left: `${((i + 1) / max) * 100}%` }} />
        ))}
      </div>
    </div>
  );
}
