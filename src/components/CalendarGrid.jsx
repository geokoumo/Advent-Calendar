import { useNavigate } from 'react-router-dom';
import CalendarTile from './CalendarTile.jsx';
import { useContent } from '../hooks/useContent.jsx';
import { MICROCOPY } from '../data/config.js';
import { useAppState } from '../hooks/useAppState.jsx';

export default function CalendarGrid() {
  const navigate = useNavigate();
  const { days } = useContent();
  const { isUnlocked, isOpened, todayDay, phase, toast } = useAppState();

  return (
    <div className="calendar-grid" role="list">
      {days.map((entry, i) => {
        const status = !isUnlocked(entry.day) ? 'locked' : isOpened(entry.day) ? 'opened' : 'available';
        return (
          <div role="listitem" key={entry.day} className={entry.day === 25 ? 'calendar-grid__finale' : ''}>
            <CalendarTile
              entry={entry}
              status={status}
              isToday={todayDay === entry.day}
              style={{ animationDelay: `${Math.min(i * 22, 500)}ms` }}
              onOpen={() => navigate(`/day/${entry.day}`)}
              onLocked={() => toast(phase === 'before' ? MICROCOPY.lockedBeforeDecember : MICROCOPY.locked)}
            />
          </div>
        );
      })}
    </div>
  );
}
