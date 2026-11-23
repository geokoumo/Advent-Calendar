import { useAppState } from '../hooks/useAppState.jsx';
import { daysUntilChristmas, daysUntilDecember } from '../utils/date.js';

export default function ChristmasCountdown() {
  const { now, phase, todayDay } = useAppState();
  let big;
  let label;
  if (phase === 'before') {
    const d = daysUntilDecember(now);
    big = d;
    label = d === 1 ? 'day until the first little door' : 'days until the first little door';
  } else if (phase === 'after' || todayDay === 25) {
    big = null;
    label = phase === 'after' ? 'Every door is open now. They’re yours to keep.' : 'It’s Christmas. Every door is open.';
  } else {
    const d = daysUntilChristmas(now);
    big = d;
    label = d === 1 ? 'day until Christmas' : 'days until Christmas';
  }
  return (
    <div className="countdown" aria-live="polite">
      {big !== null ? (
        <>
          <span className="countdown__num">{big}</span>
          <span className="countdown__label">{label}</span>
        </>
      ) : (
        <span className="countdown__label countdown__label--solo">{label}</span>
      )}
    </div>
  );
}
