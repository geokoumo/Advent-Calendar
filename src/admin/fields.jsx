import { useId, useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { getPath, newId, setPath } from './editorSchemas.js';

const toParagraphs = (t) => t.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
const toLines = (t) => t.split('\n').map((l) => l.trim()).filter(Boolean);

/** Multi-line fields keep their own text while typing, so conversions never fight the cursor. */
function TextAreaField({ id, value, kind, rows, onChange, placeholder }) {
  const initial = kind === 'paragraphs' ? (value || []).join('\n\n') : kind === 'lines' ? (value || []).join('\n') : value || '';
  const [text, setText] = useState(initial);
  return (
    <textarea
      id={id}
      className="af__input af__textarea"
      rows={rows || (kind === 'lines' ? 4 : 5)}
      value={text}
      placeholder={placeholder}
      onChange={(e) => {
        const t = e.target.value;
        setText(t);
        onChange(kind === 'paragraphs' ? toParagraphs(t) : kind === 'lines' ? toLines(t) : t);
      }}
    />
  );
}

export function Field({ field, value, onChange }) {
  const id = useId();
  const { kind, label, hint, options, placeholder } = field;

  if (kind === 'list') return <ListField field={field} value={value} onChange={onChange} />;

  if (kind === 'toggle') {
    return (
      <label className="af__toggle" htmlFor={id}>
        <input id={id} type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
        <span className="af__switch" aria-hidden="true" />
        <span>{label}</span>
      </label>
    );
  }

  let control;
  if (kind === 'select') {
    control = (
      <select id={id} className="af__input" value={value ?? ''} onChange={(e) => onChange(e.target.value || undefined)}>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    );
  } else if (kind === 'textarea' || kind === 'paragraphs' || kind === 'lines') {
    control = <TextAreaField id={id} value={value} kind={kind} rows={field.rows} onChange={onChange} placeholder={placeholder} />;
  } else if (kind === 'index') {
    control = (
      <input
        id={id}
        className="af__input af__input--short"
        type="number"
        min={1}
        inputMode="numeric"
        value={Number.isInteger(value) ? value + 1 : ''}
        onChange={(e) => onChange(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value) - 1))}
      />
    );
  } else {
    control = (
      <input
        id={id}
        className="af__input"
        type={kind === 'url' ? 'url' : 'text'}
        value={value ?? ''}
        placeholder={placeholder}
        autoCapitalize={kind === 'url' || kind === 'path' ? 'none' : undefined}
        spellCheck={kind === 'url' || kind === 'path' ? false : undefined}
        onChange={(e) => onChange(kind === 'path' || kind === 'url' ? e.target.value.trim() || null : e.target.value)}
      />
    );
  }

  return (
    <div className="af__field">
      <label className="af__label" htmlFor={id}>{label}{field.required && <span aria-hidden="true"> *</span>}</label>
      {control}
      {hint && <p className="af__hint">{hint}</p>}
      {kind === 'paragraphs' && <p className="af__hint">Leave an empty line between paragraphs.</p>}
    </div>
  );
}

function ListField({ field, value, onChange }) {
  const items = Array.isArray(value) ? value : [];
  const [version, setVersion] = useState(0); // remount items after reorder/remove so their text state stays in sync

  const update = (i, item) => onChange(items.map((it, j) => (j === i ? item : it)));
  const remove = (i) => {
    onChange(items.filter((_, j) => j !== i));
    setVersion((v) => v + 1);
  };
  const move = (i, dir) => {
    const next = [...items];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    onChange(next);
    setVersion((v) => v + 1);
  };
  const add = () => {
    const blank = Object.fromEntries(field.itemFields.map((f) => [f.path, f.kind === 'lines' ? [] : f.kind === 'index' ? 0 : '']));
    if (field.idPrefix) blank.id = newId(field.idPrefix);
    onChange([...items, blank]);
  };

  return (
    <fieldset className="af__list">
      <legend className="af__label">{field.label}</legend>
      {items.length === 0 && <p className="af__hint">Nothing here yet.</p>}
      {items.map((item, i) => (
        <div className="af__item" key={`${version}-${i}`}>
          <div className="af__item-head">
            <span className="af__item-num">{i + 1}</span>
            <div className="af__item-actions">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move item ${i + 1} up`}><ArrowUp size={15} /></button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label={`Move item ${i + 1} down`}><ArrowDown size={15} /></button>
              <button type="button" onClick={() => remove(i)} aria-label={`Remove item ${i + 1}`}><Trash2 size={15} /></button>
            </div>
          </div>
          {field.itemFields.map((f) => (
            <Field key={f.path} field={f} value={getPath(item, f.path)} onChange={(v) => update(i, setPath(item, f.path, v))} />
          ))}
        </div>
      ))}
      <button type="button" className="af__add" onClick={add}>
        <Plus size={16} aria-hidden="true" /> {field.addLabel || 'Add'}
      </button>
    </fieldset>
  );
}

/** Renders schema groups for a draft day. */
export function FieldGroups({ groups, draft, onChange }) {
  const visible = groups.filter((g) => !g.when || g.when(draft));
  return visible.map((g) => {
    const fields = g.fields.filter((f) => !f.when || f.when(draft));
    return (
      <section className="af__group" key={g.title}>
        <h3 className="af__group-title">{g.title}</h3>
        {g.hint && <p className="af__hint af__hint--group">{g.hint}</p>}
        {fields.map((f) => (
          <Field key={f.path} field={f} value={getPath(draft, f.path)} onChange={(v) => onChange(setPath(draft, f.path, v))} />
        ))}
      </section>
    );
  });
}
