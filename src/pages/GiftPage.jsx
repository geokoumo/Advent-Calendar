import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { MICROCOPY } from '../data/config.js';
import { useAppState } from '../hooks/useAppState.jsx';
import { useContent } from '../hooks/useContent.jsx';
import { formatDecemberDate } from '../utils/date.js';
import GiftRenderer from '../components/gifts/GiftRenderer.jsx';
import GiftReveal from '../components/GiftReveal.jsx';
import DayExtras from '../components/DayExtras.jsx';
import Button from '../components/Button.jsx';
import { Divider, Ornament } from '../components/decor/Decor.jsx';
import NotFound from './NotFound.jsx';

export default function GiftPage() {
  const { day: param } = useParams();
  const { days, getDay } = useContent();
  const entry = getDay(param);
  const navigate = useNavigate();
  const location = useLocation();
  const { isUnlocked, isOpened, actions, reducedMotion, phase } = useAppState();
  const unlocked = entry ? isUnlocked(entry.day) : false;
  // Capture "first time" once per visit, before we mark it opened.
  const [firstTime] = useState(() => (entry ? !isOpened(entry.day) : false));
  // Opening ceremony: 'standard' | 'grand' (longer, brighter) | 'none'. Set per day in the admin editor.
  const opening = entry?.animation?.opening || (entry?.special ? 'grand' : 'standard');
  const [revealing, setRevealing] = useState(firstTime && unlocked && opening !== 'none');
  const backTo = location.state?.from || '/calendar';

  useEffect(() => {
    if (entry && unlocked) actions.openDay(entry.day);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry?.day, unlocked]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [param]);

  const doneRevealing = useCallback(() => setRevealing(false), []);

  if (!entry) return <NotFound />;

  // Locked: never render content, never mark opened.
  if (!unlocked) {
    return (
      <div className="page gift-page gift-page--locked">
        <div className="locked-view reveal">
          <div className="locked-view__icon"><Lock size={22} strokeWidth={1.4} aria-hidden="true" /></div>
          <p className="eyebrow">December {entry.day}</p>
          <h1 className="locked-view__title">Still wrapped</h1>
          <p className="locked-view__text">{phase === 'before' ? MICROCOPY.lockedBeforeDecember : MICROCOPY.locked}</p>
          <p className="locked-view__date">Opens {formatDecemberDate(entry.day)}</p>
          <Button variant="ghost" to="/calendar">Back to the calendar</Button>
        </div>
      </div>
    );
  }

  const unlockedDays = days.filter((d) => isUnlocked(d.day)).map((d) => d.day);
  const pos = unlockedDays.indexOf(entry.day);
  const prev = unlockedDays[pos - 1];
  const next = unlockedDays[pos + 1];
  const isFinale = entry.type === 'finale';

  return (
    <div className={`page gift-page gift-page--${entry.type} ${entry.special ? 'gift-page--special' : ''} ${revealing ? 'is-hidden' : ''}`} key={entry.day}>
      {revealing && <GiftReveal day={entry.day} special={opening === 'grand'} reduced={reducedMotion} onDone={doneRevealing} />}

      <div className="gift-page__bar">
        <button className="icon-btn" onClick={() => (location.key !== 'default' ? navigate(-1) : navigate(backTo))} aria-label="Back">
          <ArrowLeft size={22} strokeWidth={1.4} />
        </button>
        <span className="gift-page__bar-day">Day {entry.day} of 25</span>
        <span className="icon-btn icon-btn--spacer" aria-hidden="true" />
      </div>

      {!isFinale && (
        <header className="gift-page__header">
          <Ornament size={30} className="gift-page__ornament reveal" color={entry.special ? 'var(--gold)' : 'var(--burgundy)'} />
          <p className="eyebrow reveal reveal-1">{formatDecemberDate(entry.day)}</p>
          <h1 className="gift-page__title reveal reveal-1">{entry.title}</h1>
          {entry.subtitle && <p className="gift-page__subtitle reveal reveal-2">{entry.subtitle}</p>}
        </header>
      )}

      {!revealing && (
        <main className="gift-page__content">
          <GiftRenderer entry={entry} />
          <DayExtras extras={entry.extras} />
        </main>
      )}

      <footer className="gift-page__footer">
        <Divider />
        <div className="gift-page__pager">
          {prev ? (
            <Link to={`/day/${prev}`} replace className="pager-link" aria-label={`Previous: day ${prev}`}>
              <ChevronLeft size={18} aria-hidden="true" /> Day {prev}
            </Link>
          ) : <span />}
          <Link to="/calendar" className="pager-link pager-link--center">All days</Link>
          {next ? (
            <Link to={`/day/${next}`} replace className="pager-link" aria-label={`Next: day ${next}`}>
              Day {next} <ChevronRight size={18} aria-hidden="true" />
            </Link>
          ) : <span />}
        </div>
      </footer>
    </div>
  );
}
