import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Play, RotateCcw, Save } from 'lucide-react';
import { useContent } from '../hooks/useContent.jsx';
import { KNOWN_TYPES } from '../data/contentStore.js';
import ConfirmationDialog from '../components/ConfirmationDialog.jsx';
import NotFound from '../pages/NotFound.jsx';
import { FieldGroups } from './fields.jsx';
import { ANIMATION_TAB, EXTRAS_TAB, GIFT_TAB, normalizeDay, SURPRISE_TAB, templateFor, TYPE_LABELS, validateDay } from './editorSchemas.js';
import { usePreviewControls } from './usePreviewControls.js';

const TABS = [
  ['gift', 'Gift'],
  ['surprise', 'Surprise'],
  ['extras', 'Extras'],
  ['animation', 'Animation'],
  ['advanced', 'Advanced'],
];

const stable = (d) => JSON.stringify(d);

function AdvancedTab({ draft, onApply, defaultFinale }) {
  const { day, ...rest } = draft;
  const [text, setText] = useState(() => JSON.stringify(rest, null, 2));
  const [error, setError] = useState(null);
  const [pendingType, setPendingType] = useState(null);

  const apply = () => {
    try {
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('The JSON must be an object.');
      setError(null);
      onApply({ ...parsed, day });
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="af__group">
      <h3 className="af__group-title">Content type</h3>
      <p className="af__hint af__hint--group">Changing the type replaces this day’s surprise with an empty template of the new type. Gifts, extras and titles are kept.</p>
      <select className="af__input" value={draft.type} onChange={(e) => setPendingType(e.target.value)} aria-label="Content type">
        {KNOWN_TYPES.map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
      </select>

      <h3 className="af__group-title af__group-title--spaced">Raw JSON</h3>
      <p className="af__hint af__hint--group">For anything the forms don’t cover. Apply, then Save.</p>
      <textarea className="af__input af__textarea af__code" rows={18} value={text} onChange={(e) => setText(e.target.value)} spellCheck="false" aria-label="Day JSON" />
      {error && <p className="af__error" role="alert">{error}</p>}
      <button type="button" className="btn btn--ghost btn--sm" onClick={apply}><span>Apply JSON</span></button>

      <ConfirmationDialog
        open={!!pendingType}
        title={`Change to “${TYPE_LABELS[pendingType]}”?`}
        message="The current surprise content will be replaced by an empty template. Nothing is saved until you press Save."
        confirmLabel="Change type"
        cancelLabel="Cancel"
        onConfirm={() => {
          onApply({ ...draft, type: pendingType, content: templateFor(pendingType, defaultFinale) });
          setPendingType(null);
        }}
        onCancel={() => setPendingType(null)}
      />
    </div>
  );
}

export default function DayEditor() {
  const { day: param } = useParams();
  const n = Number(param);
  const content = useContent();
  const navigate = useNavigate();
  const controls = usePreviewControls();
  const saved = content.getDay(n);
  const [draft, setDraft] = useState(() => (saved ? structuredClone(saved) : null));
  const [version, setVersion] = useState(0); // bump to remount fields after external changes
  const [tab, setTab] = useState('gift');
  const [errors, setErrors] = useState([]);
  const [notice, setNotice] = useState(null);
  const [confirm, setConfirm] = useState(null); // 'leave:<path>' | 'revert'

  useEffect(() => {
    setDraft(saved ? structuredClone(saved) : null);
    setVersion((v) => v + 1);
    setErrors([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  const dirty = useMemo(() => draft && saved && stable(normalizeDay(draft)) !== stable(normalizeDay(saved)), [draft, saved]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  if (!draft || !Number.isInteger(n) || n < 1 || n > 25) return <NotFound />;

  const flash = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice((m) => (m === msg ? null : m)), 3500);
  };

  const save = () => {
    const clean = normalizeDay({ ...draft, day: n });
    const errs = validateDay(clean, KNOWN_TYPES);
    setErrors(errs);
    if (errs.length) return false;
    if (!content.saveDay(clean)) {
      setErrors(['This browser refused to save (storage full or private mode).']);
      return false;
    }
    setDraft(clean);
    flash('Saved ✓');
    return true;
  };

  const go = (path) => (dirty ? setConfirm(`leave:${path}`) : navigate(path));
  const applyExternal = (d) => {
    setDraft(d);
    setVersion((v) => v + 1);
  };

  const groups =
    tab === 'gift' ? GIFT_TAB : tab === 'surprise' ? SURPRISE_TAB[draft.type] || [] : tab === 'extras' ? EXTRAS_TAB : tab === 'animation' ? ANIMATION_TAB : null;

  return (
    <div className="editor">
      <div className="editor__nav">
        <button className="btn btn--text btn--sm" onClick={() => go('/admin')}><ArrowLeft size={16} /> <span>Dashboard</span></button>
        <div className="editor__pager">
          <button className="icon-btn" disabled={n <= 1} onClick={() => go(`/admin/day/${n - 1}`)} aria-label="Previous day"><ChevronLeft size={18} /></button>
          <button className="icon-btn" disabled={n >= 25} onClick={() => go(`/admin/day/${n + 1}`)} aria-label="Next day"><ChevronRight size={18} /></button>
        </div>
      </div>

      <header className="editor__head">
        <p className="eyebrow">Day {n} · {TYPE_LABELS[draft.type] || draft.type}</p>
        <h1 className="editor__title">{draft.title || 'Untitled day'}</h1>
        <div className="admin-day__badges">
          {content.isEdited(n) ? <span className="badge badge--gold">Edited in this browser</span> : <span className="badge">Default content</span>}
          {dirty && <span className="badge badge--rose">Unsaved changes</span>}
        </div>
      </header>

      <div className="editor__tabs" role="tablist" aria-label="Edit sections">
        {TABS.map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} className={`chip ${tab === id ? 'is-active' : ''}`} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {errors.length > 0 && (
        <div className="af__errors" role="alert">
          {errors.map((e) => <p key={e}>{e}</p>)}
        </div>
      )}

      <div className="editor__panel" role="tabpanel" key={`${tab}-${version}`}>
        {tab === 'advanced' ? (
          <AdvancedTab draft={draft} onApply={applyExternal} defaultFinale={content.getDefaultDay(25).content} />
        ) : (
          <FieldGroups
            groups={groups}
            draft={draft}
            onChange={(d) => {
              setDraft(d);
              if (errors.length) setErrors([]); // stale validation clears as soon as you edit
            }}
          />
        )}
      </div>

      <div className="editor__savebar">
        <p className="editor__notice" role="status" aria-live="polite">{notice}</p>
        {content.isEdited(n) && (
          <button className="btn btn--text btn--sm" onClick={() => setConfirm('revert')}><RotateCcw size={15} /> <span>Revert to default</span></button>
        )}
        <button
          className="btn btn--ghost btn--sm"
          onClick={() => {
            if (dirty && !save()) return;
            controls.previewDay(n);
          }}
        >
          <Play size={15} /> <span>{dirty ? 'Save & preview' : 'Preview'}</span>
        </button>
        <button className="btn btn--gold btn--sm" onClick={save} disabled={!dirty}><Save size={15} /> <span>Save</span></button>
      </div>

      <ConfirmationDialog
        open={!!confirm}
        title={confirm === 'revert' ? `Revert Day ${n} to the default?` : 'Leave without saving?'}
        message={confirm === 'revert' ? 'Your saved edits for this day will be discarded.' : 'Your changes to this day will be lost.'}
        confirmLabel={confirm === 'revert' ? 'Revert' : 'Discard changes'}
        cancelLabel="Stay"
        onConfirm={() => {
          if (confirm === 'revert') {
            content.revertDay(n);
            applyExternal(structuredClone(content.getBaseDay(n)));
            flash('Reverted to default.');
          } else {
            navigate(confirm.slice('leave:'.length));
          }
          setConfirm(null);
        }}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
