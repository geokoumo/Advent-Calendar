import { useState } from 'react';
import { KeyRound, Lightbulb } from 'lucide-react';
import Button from '../Button.jsx';
import { useAppState } from '../../hooks/useAppState.jsx';
import { normalizeAnswer } from '../../utils/storage.js';
import { WaxSeal } from '../decor/Decor.jsx';

const WRONG = ['Not quite, my love.', 'Hmm. Try again?', 'So close. Probably.', 'Think about us…'];

export default function SecretMessage({ content, day }) {
  const { state, actions } = useAppState();
  const key = `secret-${day}`;
  const unlocked = !!state.completedInteractions[key];
  const [value, setValue] = useState('');
  const [tries, setTries] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [shake, setShake] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const ok = (content.answers || []).some((a) => normalizeAnswer(a) === normalizeAnswer(value));
    if (ok) {
      actions.complete(key);
    } else {
      setTries((t) => t + 1);
      setShake(true);
      setTimeout(() => setShake(false), 450);
    }
  };

  if (unlocked) {
    return (
      <article className="secret secret--open">
        <WaxSeal size={52} className="secret__seal is-broken" />
        <h2 className="secret__title reveal">{content.reveal?.title}</h2>
        {(content.reveal?.body || []).map((p, i) => (
          <p key={i} className="secret__body reveal" style={{ animationDelay: `${200 + i * 150}ms` }}>{p}</p>
        ))}
      </article>
    );
  }

  return (
    <form className={`secret ${shake ? 'is-shaking' : ''}`} onSubmit={submit}>
      <WaxSeal size={60} className="secret__seal" />
      <p className="eyebrow">A sealed message</p>
      <label htmlFor="secret-answer" className="secret__prompt">{content.prompt}</label>
      <div className="secret__field">
        <KeyRound size={17} strokeWidth={1.5} aria-hidden="true" />
        <input
          id="secret-answer"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck="false"
          placeholder="The password"
          aria-describedby="secret-feedback"
        />
      </div>
      <p id="secret-feedback" className="secret__feedback" aria-live="polite">{tries > 0 ? WRONG[(tries - 1) % WRONG.length] : ' '}</p>
      <Button variant="gold" type="submit" disabled={!value.trim()}>Break the seal</Button>
      {content.hint && (
        showHint || tries >= 2 ? (
          <p className="secret__hint"><Lightbulb size={14} aria-hidden="true" /> {content.hint}</p>
        ) : (
          <button type="button" className="secret__hint-btn" onClick={() => setShowHint(true)}>Need a hint?</button>
        )
      )}
    </form>
  );
}
