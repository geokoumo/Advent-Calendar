/* DEVELOPER PREVIEW — only compiled into dev builds (see utils/devFlags.js). */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../hooks/useAppState.jsx';
import { readDevSettings, writeDevSettings } from '../utils/devFlags.js';
import { CALENDAR_YEAR } from '../data/config.js';
import { useContent } from '../hooks/useContent.jsx';
import { EASTER_EGGS } from '../data/easterEggs.js';

const PRESETS = [
  ['Nov 23', `${CALENDAR_YEAR}-11-23`],
  ['Dec 1', `${CALENDAR_YEAR}-12-01`],
  ['Dec 12', `${CALENDAR_YEAR}-12-12`],
  ['Dec 24', `${CALENDAR_YEAR}-12-24`],
  ['Dec 25', `${CALENDAR_YEAR}-12-25`],
  ['Dec 30', `${CALENDAR_YEAR}-12-30`],
];

export default function DevPanel() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(readDevSettings);
  const { actions, now, discoverEgg } = useAppState();
  const navigate = useNavigate();
  const { days: DAYS } = useContent();

  const update = (patch) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    writeDevSettings(next);
    window.dispatchEvent(new Event('dol:dev-change'));
  };

  if (!open) {
    return (
      <button className="dev-fab" onClick={() => setOpen(true)} aria-label="Open developer preview">
        DEV
      </button>
    );
  }

  return (
    <div className="dev-panel" role="dialog" aria-label="Developer preview">
      <div className="dev-panel__head">
        <strong>Developer preview</strong>
        <button onClick={() => setOpen(false)} aria-label="Close">✕</button>
      </div>
      <p className="dev-panel__note">Not included in production builds. Simulated today: <b>{now.toDateString()}</b></p>

      <label className="dev-panel__row">
        <span>Simulated date</span>
        <input type="date" value={settings.date || ''} onChange={(e) => update({ date: e.target.value || null })} />
      </label>
      <div className="dev-panel__chips">
        {PRESETS.map(([label, d]) => (
          <button key={d} onClick={() => update({ date: d })} className={settings.date === d ? 'on' : ''}>{label}</button>
        ))}
        <button onClick={() => update({ date: null })}>Real date</button>
      </div>

      <label className="dev-panel__row dev-panel__row--check">
        <input type="checkbox" checked={settings.bypassLocks} onChange={(e) => update({ bypassLocks: e.target.checked })} />
        <span>Bypass locks (open any day)</span>
      </label>

      <div className="dev-panel__days">
        {DAYS.map((d) => (
          <button key={d.day} onClick={() => navigate(`/day/${d.day}`)} title={`${d.type}: ${d.title}`}>{d.day}</button>
        ))}
      </div>

      <div className="dev-panel__chips">
        {Object.keys(EASTER_EGGS).map((id) => (
          <button key={id} onClick={() => discoverEgg(id)}>egg: {id}</button>
        ))}
      </div>

      <button
        className="dev-panel__danger"
        onClick={() => {
          if (confirm('Reset ALL progress (opened days, coupons, favourites, secrets)?')) actions.resetAll();
        }}
      >
        Reset all progress
      </button>
    </div>
  );
}
