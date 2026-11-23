import { useState } from 'react';
import { Gift, MapPin } from 'lucide-react';
import { GiftBox } from '../decor/Decor.jsx';
import PhotoFrame from '../PhotoFrame.jsx';
import ScratchCard from './ScratchCard.jsx';
import FindTheHeart from './FindTheHeart.jsx';
import { useAppState } from '../../hooks/useAppState.jsx';

function GiftContent({ content, gifts = [] }) {
  return (
    <div className="real-gift__content">
      <h2 className="real-gift__headline reveal">{content.headline}</h2>
      {(content.message || []).map((p, i) => (
        <p key={i} className="real-gift__message reveal" style={{ animationDelay: `${150 + i * 120}ms` }}>{p}</p>
      ))}
      {gifts.length > 1 && (
        <ul className="gift-items reveal reveal-3" aria-label={`${gifts.length} gifts inside`}>
          {gifts.map((g) => (
            <li key={g.id} className="gift-items__item">
              <Gift size={15} strokeWidth={1.5} aria-hidden="true" />
              <span>{g.name}</span>
            </li>
          ))}
        </ul>
      )}
      {content.image && <div className="reveal reveal-3"><PhotoFrame photo={content.image} tilt={1.2} ratio="4 / 3" /></div>}
      {content.clue && (
        <div className="clue reveal reveal-4">
          <MapPin size={18} strokeWidth={1.5} aria-hidden="true" />
          <div>
            <p className="clue__label">Where to find it</p>
            <p className="clue__text">{content.clue}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/** A real-world present. reveal: 'unwrap' (default) | 'scratch' | 'findHeart' */
export default function RealGift({ content, day, gifts }) {
  const { state, actions, reducedMotion } = useAppState();
  const key = `gift-${day}`;
  const done = !!state.completedInteractions[key];
  const [unwrapping, setUnwrapping] = useState(false);
  const complete = () => actions.complete(key);
  const reveal = content.reveal || 'unwrap';

  if (reveal === 'scratch') {
    return (
      <div className="real-gift">
        {!done && <p className="gift-intro">Something’s hidden under the gold. Scratch it away.</p>}
        <ScratchCard revealed={done} onReveal={complete} label="Scratch here">
          <GiftContent content={content} gifts={gifts} />
        </ScratchCard>
      </div>
    );
  }

  if (done) return <div className="real-gift"><GiftContent content={content} gifts={gifts} /></div>;

  if (reveal === 'findHeart') {
    return (
      <div className="real-gift">
        <p className="gift-intro">Your surprise is hiding behind the heart. Find it.</p>
        <FindTheHeart seed={day} onFound={complete} />
      </div>
    );
  }

  return (
    <div className="real-gift">
      <button
        className={`unwrap ${unwrapping ? 'is-unwrapping' : ''}`}
        onClick={() => {
          setUnwrapping(true);
          setTimeout(complete, reducedMotion ? 0 : 900);
        }}
        aria-label="Unwrap your gift"
      >
        <GiftBox size={170} />
        <span className="unwrap__hint">Tap to unwrap</span>
      </button>
    </div>
  );
}
