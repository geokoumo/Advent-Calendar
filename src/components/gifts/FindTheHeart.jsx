import { useState } from 'react';
import { Ornament, Heart } from '../decor/Decor.jsx';

const COLORS = ['var(--burgundy)', '#8a3048', 'var(--gold)', '#5a2033', 'var(--dusty)', '#7e2c43'];

/** Tap ornaments to find the one hiding a heart. Every wrong tap gives a soft hint. */
export default function FindTheHeart({ seed = 7, count = 12, onFound }) {
  const target = (seed * 5 + 3) % count;
  const [flipped, setFlipped] = useState([]);
  const [found, setFound] = useState(false);
  const [hint, setHint] = useState('One of these ornaments is hiding something.');

  const tap = (i) => {
    if (found || flipped.includes(i)) return;
    setFlipped((f) => [...f, i]);
    if (i === target) {
      setFound(true);
      setHint('There it is.');
      setTimeout(() => onFound?.(), 900);
    } else {
      const dist = Math.abs((i % 4) - (target % 4)) + Math.abs(Math.floor(i / 4) - Math.floor(target / 4));
      setHint(dist <= 1 ? 'Warm… very warm.' : dist === 2 ? 'Getting warmer.' : 'Cold. Like your hands.');
    }
  };

  return (
    <div className="find-heart">
      <p className="find-heart__hint" aria-live="polite">{hint}</p>
      <div className="find-heart__grid">
        {Array.from({ length: count }, (_, i) => {
          const open = flipped.includes(i);
          const isHeart = i === target;
          return (
            <button
              key={i}
              className={`find-heart__item ${open ? 'is-open' : ''} ${open && isHeart ? 'is-heart' : ''}`}
              onClick={() => tap(i)}
              aria-label={open ? (isHeart ? 'The heart!' : 'Empty ornament') : `Ornament ${i + 1}`}
              disabled={found && !isHeart}
              style={{ '--sway': `${(i % 3) - 1}deg`, animationDelay: `${(i % 5) * 0.4}s` }}
            >
              {open ? (
                isHeart ? <Heart size={30} className="find-heart__heart" /> : <span className="find-heart__empty" aria-hidden="true">·</span>
              ) : (
                <Ornament size={34} color={COLORS[i % COLORS.length]} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
