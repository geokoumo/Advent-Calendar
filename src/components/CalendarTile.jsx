import { useState } from 'react';
import { Lock } from 'lucide-react';
import { Heart, Star } from './decor/Decor.jsx';

const RIBBONS = ['cross', 'vertical', 'horizontal', 'diagonal'];

/**
 * status: 'locked' | 'available' | 'opened'
 * Titles are only shown once opened, so nothing is spoiled.
 */
export default function CalendarTile({ entry, status, isToday, onOpen, onLocked, style }) {
  const [shake, setShake] = useState(false);
  const { day, special } = entry;
  const finale = day === 25;
  const ribbon = finale ? 'cross' : RIBBONS[(day * 7) % 4];
  const stateLabel = status === 'locked' ? 'locked' : status === 'opened' ? 'opened' : isToday ? 'today, ready to open' : 'ready to open';

  const handle = () => {
    if (status === 'locked') {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      onLocked?.(entry);
      return;
    }
    onOpen?.(entry);
  };

  return (
    <button
      type="button"
      className={[
        'tile',
        `tile--${status}`,
        `tile--ribbon-${ribbon}`,
        special && 'tile--special',
        finale && 'tile--finale',
        isToday && 'tile--today',
        shake && 'is-shaking',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={handle}
      aria-label={`December ${day}, ${stateLabel}${status === 'opened' ? `: ${entry.title}` : ''}`}
      aria-disabled={status === 'locked'}
      style={style}
    >
      <span className="tile__ribbon" aria-hidden="true" />
      <span className="tile__num" aria-hidden="true">{day}</span>
      {finale && status !== 'opened' && <span className="tile__finale-label" aria-hidden="true">The final chapter</span>}
      {status === 'opened' && <span className="tile__title" aria-hidden="true">{entry.title}</span>}
      <span className="tile__mark" aria-hidden="true">
        {status === 'locked' && <Lock size={12} strokeWidth={1.6} />}
        {status === 'opened' && <Heart size={11} />}
        {status === 'available' && <Star size={11} />}
      </span>
    </button>
  );
}
