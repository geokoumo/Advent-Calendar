import { useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { CATEGORIES, MESSAGES } from '../data/messages.js';
import { useAppState } from '../hooks/useAppState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Button from '../components/Button.jsx';
import { Divider, Heart } from '../components/decor/Decor.jsx';

/** Picks a message, avoiding the current one and recently seen ones whenever possible. */
function pick(pool, recent, currentId) {
  const fresh = pool.filter((m) => m.id !== currentId && !recent.includes(m.id));
  const fallback = pool.filter((m) => m.id !== currentId);
  const from = fresh.length ? fresh : fallback.length ? fallback : pool;
  return from[Math.floor(Math.random() * from.length)];
}

function Words({ text }) {
  return (
    <span className="words">
      {text.split(' ').map((w, i) => (
        <span key={i} style={{ animationDelay: `${i * 45}ms` }}>{w} </span>
      ))}
    </span>
  );
}

export default function ForYou() {
  const { state, actions } = useAppState();
  const [category, setCategory] = useState(null);
  const [message, setMessage] = useState(null);
  const [draw, setDraw] = useState(0);

  const pool = useMemo(() => (category ? MESSAGES.filter((m) => m.category === category) : MESSAGES), [category]);
  const reveal = (cat = category) => {
    const p = cat ? MESSAGES.filter((m) => m.category === cat) : MESSAGES;
    const m = pick(p, state.recentMessages, message?.id);
    if (!m) return;
    setMessage(m);
    setDraw((d) => d + 1);
    actions.seenMessage(m.id);
  };

  const fav = message && state.favoriteMessages.includes(message.id);
  const favourites = MESSAGES.filter((m) => state.favoriteMessages.includes(m.id));
  const catLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label;

  return (
    <div className="page foryou">
      <PageHeader eyebrow="Always here" title="Whenever You Need Me">
        For the days that need a little more. This page never locks.
      </PageHeader>

      <div className="chips chips--scroll reveal reveal-1" role="group" aria-label="What do you need?">
        <button className={`chip ${!category ? 'is-active' : ''}`} aria-pressed={!category} onClick={() => setCategory(null)}>Anything</button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={`chip ${category === c.id ? 'is-active' : ''}`}
            aria-pressed={category === c.id}
            onClick={() => {
              setCategory(c.id);
              if (message) reveal(c.id);
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {!message ? (
        <div className="foryou__start reveal reveal-2">
          <button className="need-me" onClick={() => reveal()}>
            <span className="need-me__glow" aria-hidden="true" />
            <span className="need-me__text">Whenever you need me</span>
            <Heart size={20} className="need-me__heart" />
          </button>
          <p className="foryou__hint">{pool.length} little reminders, waiting</p>
        </div>
      ) : (
        <div className="foryou__reveal">
          <article className="love-note" key={draw} aria-live="polite">
            <p className="love-note__cat">{catLabel(message.category)}</p>
            <p className="love-note__text"><Words text={message.text} /></p>
            <p className="love-note__sign">— always, me</p>
            <button
              className={`love-note__fav ${fav ? 'is-fav' : ''}`}
              onClick={() => actions.toggleFavorite(message.id)}
              aria-pressed={fav}
              aria-label={fav ? 'Remove from kept close' : 'Keep this one close'}
            >
              <Heart size={20} filled={fav} />
            </button>
          </article>
          <Button variant="ghost" icon={RefreshCw} onClick={() => reveal()}>Another little reminder</Button>
        </div>
      )}

      {favourites.length > 0 && (
        <section className="kept" aria-labelledby="kept-title">
          <Divider glyph="heart" />
          <h2 id="kept-title" className="kept__title">Kept close</h2>
          <ul className="kept__list">
            {favourites.map((m) => (
              <li key={m.id} className="kept__item">
                <p>{m.text}</p>
                <button className="kept__remove" onClick={() => actions.toggleFavorite(m.id)} aria-label="Remove from kept close">
                  <Heart size={14} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
