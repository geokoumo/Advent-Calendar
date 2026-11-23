import { useRef } from 'react';
import { Lock } from 'lucide-react';
import CalendarGrid from '../components/CalendarGrid.jsx';
import { useAppState } from '../hooks/useAppState.jsx';
import { TOTAL_DAYS } from '../data/calendar.js';
import { CALENDAR_YEAR, GREETINGS } from '../data/config.js';
import { Heart, Star, WaxSeal } from '../components/decor/Decor.jsx';

export default function CalendarPage() {
  const { state, phase, discoverEgg } = useAppState();
  const hold = useRef();

  // Secret: press and hold the wax seal.
  const startHold = () => {
    clearTimeout(hold.current);
    hold.current = setTimeout(() => discoverEgg('seal'), 1000);
  };
  const endHold = () => clearTimeout(hold.current);

  return (
    <div className="page calendar-page">
      <header className="calendar-page__header reveal">
        <div
          className="calendar-page__seal"
          onPointerDown={startHold}
          onPointerUp={endHold}
          onPointerLeave={endHold}
          onPointerCancel={endHold}
          onContextMenu={(e) => e.preventDefault()}
        >
          <WaxSeal size={58} initial="25" />
        </div>
        <p className="eyebrow">December {CALENDAR_YEAR}</p>
        <h1 className="calendar-page__title">The Advent Calendar</h1>
        <p className="calendar-page__sub">
          {phase === 'before'
            ? GREETINGS.before
            : phase === 'after'
              ? 'Every door is open now — forever.'
              : `${state.openedDays.length} of ${TOTAL_DAYS} doors opened`}
        </p>
      </header>

      <ul className="legend reveal reveal-1" aria-label="Legend">
        <li><span className="legend__swatch legend__swatch--available"><Star size={9} /></span> Ready</li>
        <li><span className="legend__swatch legend__swatch--opened"><Heart size={9} /></span> Opened</li>
        <li><span className="legend__swatch legend__swatch--locked"><Lock size={9} /></span> Not yet</li>
      </ul>

      <CalendarGrid />
    </div>
  );
}
