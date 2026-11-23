import { Link } from 'react-router-dom';
import { ArrowRight, Lock } from 'lucide-react';
import { getDay, TOTAL_DAYS } from '../data/calendar.js';
import { useAppState } from '../hooks/useAppState.jsx';
import { daysUntilDecember, formatDecemberDate } from '../utils/date.js';
import { GiftBox, Ornament } from './decor/Decor.jsx';

/** The featured card on Home: today's surprise, or the right state around it. */
export default function DailyGiftCard() {
  const { phase, todayDay, isOpened, now, state } = useAppState();

  if (phase === 'before') {
    const d = daysUntilDecember(now);
    return (
      <article className="gift-card gift-card--waiting">
        <div className="gift-card__art"><GiftBox size={96} /></div>
        <div className="gift-card__body">
          <p className="eyebrow">Day 1 · {formatDecemberDate(1, { month: 'long', day: 'numeric' })}</p>
          <h2 className="gift-card__title">The first door is still wrapped</h2>
          <p className="gift-card__teaser">
            {d === 1 ? 'Tomorrow, the first little surprise.' : `In ${d} days, the first little surprise.`} Until then, take a look around.
          </p>
          <span className="gift-card__cta gift-card__cta--muted"><Lock size={15} aria-hidden="true" /> Opens December 1</span>
        </div>
      </article>
    );
  }

  if (phase === 'after') {
    const finale = getDay(25);
    return (
      <Link to="/day/25" className="gift-card gift-card--after">
        <div className="gift-card__art"><Ornament size={54} color="var(--burgundy)" /></div>
        <div className="gift-card__body">
          <p className="eyebrow">{state.openedDays.length} of {TOTAL_DAYS} opened</p>
          <h2 className="gift-card__title">{finale.title}</h2>
          <p className="gift-card__teaser">Christmas is over, but nothing here ever closes. Come back whenever you like.</p>
          <span className="gift-card__cta">Read it again <ArrowRight size={16} aria-hidden="true" /></span>
        </div>
      </Link>
    );
  }

  const entry = getDay(todayDay);
  if (!entry) return null;
  const opened = isOpened(entry.day);
  return (
    <Link to={`/day/${entry.day}`} className={`gift-card ${entry.special ? 'gift-card--special' : ''} ${opened ? 'gift-card--opened' : ''}`}>
      <div className="gift-card__art">
        <span className="gift-card__day" aria-hidden="true">{entry.day}</span>
        <GiftBox size={96} className={opened ? 'is-open' : ''} />
      </div>
      <div className="gift-card__body">
        <p className="eyebrow">Today · December {entry.day}</p>
        <h2 className="gift-card__title">{opened ? entry.title : 'A surprise is waiting'}</h2>
        <p className="gift-card__teaser">{entry.teaser}</p>
        <span className="gift-card__cta">
          {opened ? 'Open it again' : 'Open today’s gift'} <ArrowRight size={16} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
