import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Divider } from '../decor/Decor.jsx';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'];

export default function ReasonsGift({ content }) {
  const [open, setOpen] = useState([]);
  const reasons = content.reasons || [];
  const toggle = (i) => setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));
  const all = open.length === reasons.length;

  return (
    <div className="reasons">
      {content.intro && <p className="gift-intro reveal">{content.intro}</p>}
      <ul className="reasons__list">
        {reasons.map((r, i) => {
          const isOpen = open.includes(i);
          return (
            <li key={i} className={`reason ${isOpen ? 'is-open' : ''} reveal`} style={{ animationDelay: `${100 + i * 60}ms` }}>
              <button className="reason__head" aria-expanded={isOpen} aria-controls={`reason-${i}`} onClick={() => toggle(i)}>
                <span className="reason__num">{ROMAN[i] || i + 1}</span>
                <span className="reason__title">{r.title}</span>
                <Plus size={18} strokeWidth={1.4} className="reason__icon" aria-hidden="true" />
              </button>
              <div id={`reason-${i}`} className="reason__panel" role="region" hidden={!isOpen}>
                <p>{r.text}</p>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="reasons__count" aria-live="polite">{open.length} of {reasons.length} opened</p>
      {all && content.closing && (
        <>
          <Divider glyph="heart" />
          <p className="reasons__closing reveal">{content.closing}</p>
        </>
      )}
    </div>
  );
}
