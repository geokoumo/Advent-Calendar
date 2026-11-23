import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, LayoutDashboard, RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import { useAppState } from '../hooks/useAppState.jsx';
import { useAuth } from '../auth/AuthContext.jsx';
import { useContent } from '../hooks/useContent.jsx';
import { CALENDAR_YEAR } from '../data/config.js';
import Modal from '../components/Modal.jsx';
import ConfirmationDialog from '../components/ConfirmationDialog.jsx';
import { couponIdsOf, usePreviewControls } from './usePreviewControls.js';
import './admin.css';

export const DATE_PRESETS = [
  ['Real date', null],
  ['Nov 30', `${CALENDAR_YEAR}-11-30`],
  ['Dec 1', `${CALENDAR_YEAR}-12-01`],
  ['Dec 12', `${CALENDAR_YEAR}-12-12`],
  ['Dec 24', `${CALENDAR_YEAR}-12-24`],
  ['Dec 25', `${CALENDAR_YEAR}-12-25`],
  ['Dec 28', `${CALENDAR_YEAR}-12-28`],
];

const fmt = (d) => (d ? new Date(`${d}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Real date');

function PreviewBar() {
  const { adminMode, setAdminMode } = useAuth();
  const { actions, now } = useAppState();
  const { getDay } = useContent();
  const controls = usePreviewControls();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const currentDay = Number(location.pathname.match(/^\/day\/(\d+)/)?.[1]) || null;

  const update = (patch) => setAdminMode({ ...adminMode, ...patch });
  const replay = (day) => {
    actions.forgetDay(day, couponIdsOf(getDay(day)));
    setOpen(false);
    navigate(`/day/${day}`, { state: { replay: Date.now(), from: '/calendar' } });
  };

  return (
    <>
      <div className="preview-bar" role="region" aria-label="Admin preview">
        <span className="preview-bar__badge">Admin preview</span>
        <span className="preview-bar__info">
          {fmt(adminMode.date)} · {adminMode.unlockAll ? 'all unlocked' : 'real locks'}
        </span>
        <button className="preview-bar__btn" onClick={() => setOpen(true)} aria-label="Preview controls">
          <SlidersHorizontal size={16} />
        </button>
        <button className="preview-bar__btn" onClick={controls.exitToDashboard} aria-label="Exit preview">
          <X size={16} /> <span className="preview-bar__exit">Exit</span>
        </button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} labelledBy="pv-title" className="pv-sheet">
        <p className="eyebrow">Admin preview</p>
        <h2 id="pv-title" className="pv-sheet__title">Preview controls</h2>
        <p className="pv-sheet__note">Nothing you do here touches Gina’s real progress. Today in preview: <b>{now.toDateString()}</b></p>

        <h3 className="pv-sheet__h">Simulated date</h3>
        <div className="pv-chips">
          {DATE_PRESETS.map(([label, d]) => (
            <button key={label} className={`chip ${adminMode.date === d ? 'is-active' : ''}`} onClick={() => update({ date: d })}>{label}</button>
          ))}
        </div>
        <input
          className="af__input pv-sheet__date"
          type="date"
          aria-label="Custom simulated date"
          value={adminMode.date || ''}
          onChange={(e) => update({ date: e.target.value || null })}
        />

        <label className="af__toggle pv-sheet__toggle">
          <input type="checkbox" checked={!!adminMode.unlockAll} onChange={(e) => update({ unlockAll: e.target.checked })} />
          <span className="af__switch" aria-hidden="true" />
          <span>Unlock every day (turn off to test locked days)</span>
        </label>

        <h3 className="pv-sheet__h">Preview a day</h3>
        <div className="pv-days">
          {Array.from({ length: 25 }, (_, i) => i + 1).map((d) => (
            <button key={d} className={`pv-days__btn ${d === currentDay ? 'is-current' : ''}`} onClick={() => replay(d)} aria-label={`Preview day ${d}`}>{d}</button>
          ))}
        </div>

        <div className="pv-sheet__actions">
          {currentDay && (
            <button className="btn btn--ghost btn--sm" onClick={() => replay(currentDay)}><RotateCcw size={15} /> <span>Replay day {currentDay}</span></button>
          )}
          <button className="btn btn--ghost btn--sm" onClick={() => { setOpen(false); navigate('/calendar'); }}><span>All 25 days</span></button>
          <button className="btn btn--ghost btn--sm" onClick={() => { setOpen(false); controls.viewAsGina(); }}><Eye size={15} /> <span>View as Gina</span></button>
          <button className="btn btn--ghost btn--sm" onClick={() => setConfirmReset(true)}><span>Reset preview data</span></button>
          <button className="btn btn--gold btn--sm" onClick={controls.exitToDashboard}><LayoutDashboard size={15} /> <span>Exit to dashboard</span></button>
        </div>
      </Modal>

      <ConfirmationDialog
        open={confirmReset}
        title="Reset preview data?"
        message="Clears what you opened, redeemed and answered while previewing. Gina’s real progress is not affected."
        confirmLabel="Reset preview"
        cancelLabel="Cancel"
        onConfirm={() => { actions.resetAll(); setConfirmReset(false); setOpen(false); }}
        onCancel={() => setConfirmReset(false)}
      />
    </>
  );
}

function GinaViewBar() {
  const controls = usePreviewControls();
  return (
    <div className="gina-bar" role="region" aria-label="Viewing as Gina">
      <span>Viewing as Gina · real dates &amp; locks</span>
      <button className="gina-bar__exit" onClick={controls.exitToDashboard}>Exit</button>
    </div>
  );
}

/** Rendered by AppShell only in admin modes. */
export default function AdminOverlay() {
  const { mode } = useAppState();
  if (mode === 'preview') return <PreviewBar />;
  if (mode === 'gina-view') return <GinaViewBar />;
  return null;
}
