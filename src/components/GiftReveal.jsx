import { useEffect, useState } from 'react';
import { GiftBox } from './decor/Decor.jsx';

/**
 * First-time opening ceremony: the box lifts its lid, light spills out,
 * then the overlay dissolves into the gift. Tap anywhere (or the button) to skip.
 * Skipped entirely when motion is reduced.
 */
export default function GiftReveal({ day, special, onDone, reduced }) {
  const [phase, setPhase] = useState('in'); // in → open → out

  useEffect(() => {
    if (reduced) {
      onDone();
      return;
    }
    const t1 = setTimeout(() => setPhase('open'), 650);
    const t2 = setTimeout(() => setPhase('out'), special ? 2000 : 1550);
    const t3 = setTimeout(onDone, special ? 2550 : 2050);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [onDone, reduced, special]);

  if (reduced) return null;
  return (
    <div className={`reveal-overlay is-${phase} ${special ? 'is-special' : ''}`} onClick={onDone} role="presentation">
      <div className="reveal-overlay__glow" aria-hidden="true" />
      <div className="reveal-overlay__box">
        <GiftBox size={150} />
      </div>
      <p className="reveal-overlay__day" aria-hidden="true">December {day}</p>
      <button className="reveal-overlay__skip" onClick={onDone}>Skip</button>
    </div>
  );
}
