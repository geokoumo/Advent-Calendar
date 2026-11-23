import { useMemo, useState } from 'react';
import { useContent } from '../hooks/useContent.jsx';
import { MICROCOPY } from '../data/config.js';
import { EASTER_EGG_COUNT } from '../data/easterEggs.js';
import { useAppState } from '../hooks/useAppState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import MemoryCard from '../components/MemoryCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Button from '../components/Button.jsx';
import { Star } from '../components/decor/Decor.jsx';

const FILTERS = [
  { id: 'all', label: 'Everything', types: null },
  { id: 'words', label: 'Words', types: ['letter', 'secret', 'reasons', 'video'] },
  { id: 'moments', label: 'Moments', types: ['photo', 'dream', 'game', 'song'] },
  { id: 'gifts', label: 'Gifts & dates', types: ['gift', 'coupon', 'date', 'finale'] },
];

export default function Memories() {
  const { state } = useAppState();
  const { days } = useContent();
  const [filter, setFilter] = useState('all');

  // De-duplicated, ordered by day, excluding entries marked memory:false.
  const memories = useMemo(() => {
    const opened = new Set(state.openedDays);
    return days.filter((d) => opened.has(d.day) && d.memory !== false);
  }, [state.openedDays, days]);

  const types = FILTERS.find((f) => f.id === filter)?.types;
  const shown = types ? memories.filter((m) => types.includes(m.type)) : memories;
  const eggs = state.discoveredEasterEggs.length;

  return (
    <div className="page memories-page">
      <PageHeader eyebrow="A scrapbook" title="Our Memories">
        {memories.length ? `${memories.length} little pieces of us, kept here forever.` : 'Every door you open leaves something here.'}
      </PageHeader>

      {memories.length === 0 ? (
        <EmptyState title={MICROCOPY.emptyMemories} action={<Button variant="gold" to="/calendar">Open the calendar</Button>}>
          Each surprise you open is pressed between these pages, so you can come back to it whenever you like.
        </EmptyState>
      ) : (
        <>
          <div className="chips reveal reveal-1" role="tablist" aria-label="Filter memories">
            {FILTERS.map((f) => (
              <button key={f.id} role="tab" aria-selected={filter === f.id} className={`chip ${filter === f.id ? 'is-active' : ''}`} onClick={() => setFilter(f.id)}>
                {f.label}
              </button>
            ))}
          </div>
          {shown.length ? (
            <div className="scrapbook">
              {shown.map((m, i) => (
                <MemoryCard key={m.day} entry={m} openedAt={state.openedAt[m.day]} index={i} />
              ))}
            </div>
          ) : (
            <p className="memories-page__none">Nothing here yet — soon.</p>
          )}
        </>
      )}

      {eggs > 0 && (
        <p className="memories-page__eggs">
          <Star size={10} /> {eggs} of {EASTER_EGG_COUNT} secrets found
        </p>
      )}
    </div>
  );
}
