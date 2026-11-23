import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarRange, Download, Eye, Gift, Heart, KeyRound, Lock, LockOpen, Pencil, Play, RotateCcw, Sparkles, Trash2, Upload } from 'lucide-react';
import { useContent } from '../hooks/useContent.jsx';
import { sanitizeOverrides } from '../data/contentStore.js';
import { clearState, loadState, PREVIEW_STORAGE_KEY, STORAGE_KEY } from '../utils/storage.js';
import { daysUntilDecember, getPhase, getTodayDay, isDayUnlocked } from '../utils/date.js';
import ConfirmationDialog from '../components/ConfirmationDialog.jsx';
import { TYPE_LABELS } from './editorSchemas.js';
import { DATE_PRESETS } from './AdminOverlay.jsx';
import { usePreviewControls } from './usePreviewControls.js';

const CONFIRMS = {
  resetProgress: {
    title: 'Reset Gina’s progress?',
    message: 'Clears every opened day, redeemed coupon, favourite and secret saved in THIS browser. It cannot be undone. (Her own phone keeps its own progress.)',
    confirmLabel: 'Reset progress',
  },
  resetPreview: {
    title: 'Reset preview data?',
    message: 'Clears everything opened while previewing. Gina’s progress is not affected.',
    confirmLabel: 'Reset preview',
  },
  restoreContent: {
    title: 'Restore default content?',
    message: 'Discards every edit saved in this browser’s editor and returns all 25 days to the original content. Export first if you want a backup.',
    confirmLabel: 'Restore defaults',
  },
};

function Stat({ icon: Icon, label, value, detail }) {
  return (
    <div className="stat">
      <p className="stat__label"><Icon size={14} aria-hidden="true" /> {label}</p>
      <p className="stat__value">{value}</p>
      {detail && <p className="stat__detail">{detail}</p>}
    </div>
  );
}

export default function Dashboard() {
  const content = useContent();
  const { days } = content;
  const controls = usePreviewControls();
  const [simDate, setSimDate] = useState(null);
  const [confirm, setConfirm] = useState(null); // key of CONFIRMS | { import: {...} }
  const [notice, setNotice] = useState(null);
  const [progressVersion, setProgressVersion] = useState(0);
  const fileRef = useRef(null);

  const today = new Date();
  const phase = getPhase(today);
  const todayDay = getTodayDay(today);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const live = useMemo(() => loadState(STORAGE_KEY), [progressVersion]);
  const unlockedCount = days.filter((d) => isDayUnlocked(d.day, today)).length;
  const allGifts = days.flatMap((d) => d.gifts || []);
  const sephora = allGifts.filter((g) => /sephora/i.test(g.brand || '')).length;
  const combined = days.filter((d) => (d.gifts || []).length > 1).map((d) => d.day);

  const flash = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice((n) => (n === msg ? null : n)), 4000);
  };

  const status =
    phase === 'before'
      ? `Before December — Day 1 opens in ${daysUntilDecember(today)} day${daysUntilDecember(today) === 1 ? '' : 's'}`
      : phase === 'after'
        ? 'After Christmas — every day is open'
        : `Live — today is Day ${todayDay}`;

  const runConfirm = () => {
    if (confirm === 'resetProgress') {
      clearState(STORAGE_KEY);
      setProgressVersion((v) => v + 1);
      flash('Gina’s progress on this browser was reset.');
    } else if (confirm === 'resetPreview') {
      clearState(PREVIEW_STORAGE_KEY);
      flash('Preview data cleared.');
    } else if (confirm === 'restoreContent') {
      content.restoreDefaults();
      flash('All 25 days restored to the default content.');
    } else if (confirm?.import) {
      try {
        const n = content.importJSON(confirm.import.text);
        flash(`Imported ${n} day${n === 1 ? '' : 's'}.`);
      } catch (e) {
        flash(`Import failed: ${e.message}`);
      }
    }
    setConfirm(null);
  };

  const exportContent = () => {
    const blob = new Blob([content.exportJSON()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: url, download: 'content-overrides.json' });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    flash('Exported content-overrides.json');
  };

  const pickImport = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      const count = Object.keys(sanitizeOverrides(JSON.parse(text))).length;
      if (!count) throw new Error('no valid days found');
      setConfirm({ import: { text, count, name: file.name } });
    } catch (err) {
      flash(`That file can’t be imported: ${err.message}`);
    }
  };

  const confirmCfg = confirm?.import
    ? { title: `Import ${confirm.import.count} day${confirm.import.count === 1 ? '' : 's'}?`, message: `From “${confirm.import.name}”. Your local edits for those days will be replaced.`, confirmLabel: 'Import' }
    : CONFIRMS[confirm];

  return (
    <div className="dash">
      <header className="dash__head">
        <p className="eyebrow">Admin dashboard</p>
        <h1 className="dash__title">Behind the ribbon</h1>
        <p className="dash__sub">Preview, edit and test every door — without touching Gina’s progress.</p>
      </header>

      <p className="dash__notice" role="status" aria-live="polite">{notice}</p>

      {/* ---------- Overview ---------- */}
      <section className="dash__section" aria-labelledby="ov-title">
        <h2 id="ov-title" className="dash__h">Overview</h2>
        <div className="stats">
          <Stat icon={CalendarRange} label="Calendar days" value={days.length} detail={status} />
          <Stat icon={Gift} label="Gifts" value={allGifts.length} detail={`${sephora} Sephora · combined on days ${combined.join(', ') || '—'}`} />
          <Stat icon={LockOpen} label="Unlocked today" value={`${unlockedCount} / 25`} detail="By the real date" />
          <Stat icon={Heart} label="Opened in this browser" value={`${live.openedDays.length} / 25`} detail={`${live.discoveredEasterEggs.length} secret${live.discoveredEasterEggs.length === 1 ? '' : 's'} found · ${Object.keys(live.redeemedCoupons).length} coupon(s) redeemed`} />
          <Stat icon={Eye} label="Preview mode" value="Off" detail={`${content.editedCount} day${content.editedCount === 1 ? '' : 's'} edited locally`} />
        </div>
      </section>

      {/* ---------- Preview & testing ---------- */}
      <section className="dash__section" aria-labelledby="pv-tools">
        <h2 id="pv-tools" className="dash__h">Preview &amp; testing</h2>
        <div className="tool-card">
          <p className="af__label">Simulated date for previews</p>
          <div className="pv-chips">
            {DATE_PRESETS.map(([label, d]) => (
              <button key={label} className={`chip ${simDate === d ? 'is-active' : ''}`} onClick={() => setSimDate(d)}>{label}</button>
            ))}
          </div>
          <input className="af__input pv-sheet__date" type="date" aria-label="Custom simulated date" value={simDate || ''} onChange={(e) => setSimDate(e.target.value || null)} />
          <div className="tool-grid">
            <button className="btn btn--gold btn--sm" onClick={() => controls.previewAll(simDate)}><Sparkles size={15} /> <span>Preview all 25 days</span></button>
            <button className="btn btn--ghost btn--sm" onClick={() => controls.testDate(simDate)}><Lock size={15} /> <span>Test locks on this date</span></button>
            <button className="btn btn--ghost btn--sm" onClick={() => controls.previewDay(25, simDate)}><Play size={15} /> <span>Test Day 25 finale</span></button>
            <button className="btn btn--ghost btn--sm" onClick={controls.viewAsGina}><Eye size={15} /> <span>View as Gina</span></button>
            <Link className="btn btn--ghost btn--sm" to="/admin/login-preview"><KeyRound size={15} /> <span>Test the login screen</span></Link>
          </div>
          <p className="af__hint">“Test locks” uses real unlocking rules on the simulated date, starting from an empty preview. Previews never write to Gina’s progress.</p>
        </div>
      </section>

      {/* ---------- Calendar management ---------- */}
      <section className="dash__section" aria-labelledby="cal-title">
        <h2 id="cal-title" className="dash__h">Calendar</h2>
        <div className="admin-grid">
          {days.map((d) => {
            const unlocked = isDayUnlocked(d.day, today);
            const gifts = d.gifts || [];
            return (
              <article key={d.day} className={`admin-day ${d.special ? 'is-special' : ''}`}>
                <div className="admin-day__top">
                  <span className="admin-day__num">{d.day}</span>
                  <span className="admin-day__type">{TYPE_LABELS[d.type] || d.type}</span>
                </div>
                <h3 className="admin-day__title">{d.title}</h3>
                <p className="admin-day__gifts">{gifts.length ? gifts.map((g) => g.name).join(' + ') : 'No physical gift'}</p>
                <div className="admin-day__badges">
                  {content.isEdited(d.day) && <span className="badge badge--gold">Edited</span>}
                  {!content.isEdited(d.day) && content.isPublished(d.day) && <span className="badge">Published edit</span>}
                  {gifts.length > 1 && <span className="badge">Combined</span>}
                  <span className="badge">{unlocked ? 'Unlocked' : `Opens Dec ${d.day}`}</span>
                  {live.openedDays.includes(d.day) && <span className="badge badge--rose">Opened</span>}
                </div>
                <div className="admin-day__actions">
                  <button className="btn btn--gold btn--sm" onClick={() => controls.previewDay(d.day, simDate)} aria-label={`Preview day ${d.day}`}><Play size={14} /> <span>Preview</span></button>
                  <Link className="btn btn--ghost btn--sm" to={`/admin/day/${d.day}`} aria-label={`Edit day ${d.day}`}><Pencil size={14} /> <span>Edit</span></Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ---------- Content & data ---------- */}
      <section className="dash__section" aria-labelledby="data-title">
        <h2 id="data-title" className="dash__h">Content &amp; data</h2>
        <div className="tool-card">
          <div className="tool-grid">
            <button className="btn btn--ghost btn--sm" onClick={exportContent}><Download size={15} /> <span>Export content</span></button>
            <button className="btn btn--ghost btn--sm" onClick={() => fileRef.current?.click()}><Upload size={15} /> <span>Import content</span></button>
            <button className="btn btn--ghost btn--sm" onClick={() => setConfirm('restoreContent')} disabled={!content.editedCount}><RotateCcw size={15} /> <span>Restore default content</span></button>
            <button className="btn btn--ghost btn--sm" onClick={() => setConfirm('resetPreview')}><RotateCcw size={15} /> <span>Reset preview data</span></button>
            <button className="btn btn--danger btn--sm" onClick={() => setConfirm('resetProgress')}><Trash2 size={15} /> <span>Reset Gina’s progress</span></button>
          </div>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={pickImport} />
          <p className="af__hint">
            Edits are saved in this browser. To publish them to Gina’s phone, export, save the file as <code>src/data/content-overrides.json</code>, commit and redeploy.
            Progress is stored per device, so “Reset Gina’s progress” only affects this browser.
          </p>
        </div>
      </section>

      <ConfirmationDialog
        open={!!confirm}
        title={confirmCfg?.title}
        message={confirmCfg?.message}
        confirmLabel={confirmCfg?.confirmLabel}
        cancelLabel="Cancel"
        onConfirm={runConfirm}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
