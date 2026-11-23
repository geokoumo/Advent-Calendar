import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CONTENT_VERSION, contentAdapter, DEFAULT_DAYS, mergeDays, PUBLISHED_OVERRIDES, sanitizeOverrides } from '../data/contentStore.js';

const ContentContext = createContext(null);

/** Provides the effective 25 days (defaults + published + local admin edits). */
export function ContentProvider({ children }) {
  const [overrides, setOverrides] = useState(() => contentAdapter.load());
  const days = useMemo(() => mergeDays(overrides), [overrides]);

  const persist = useCallback((next) => {
    setOverrides(next);
    return contentAdapter.save(next);
  }, []);

  const value = useMemo(
    () => ({
      days,
      getDay: (n) => days.find((d) => d.day === Number(n)) || null,
      getDefaultDay: (n) => DEFAULT_DAYS.find((d) => d.day === Number(n)) || null,
      /** What a day becomes after reverting local edits: the published edit, else the default. */
      getBaseDay: (n) => PUBLISHED_OVERRIDES[Number(n)] || DEFAULT_DAYS.find((d) => d.day === Number(n)) || null,
      isEdited: (n) => !!overrides[n],
      isPublished: (n) => !!PUBLISHED_OVERRIDES[n],
      editedCount: Object.keys(overrides).length,
      saveDay: (day) => persist({ ...overrides, [day.day]: { ...day } }),
      revertDay: (n) => {
        const next = { ...overrides };
        delete next[n];
        return persist(next);
      },
      restoreDefaults: () => {
        contentAdapter.clear();
        setOverrides({});
      },
      /** Everything that differs from calendar.js (published + local) as a publishable file. */
      exportJSON: () => {
        const all = { ...PUBLISHED_OVERRIDES, ...overrides };
        return JSON.stringify({ version: CONTENT_VERSION, exportedAt: new Date().toISOString(), days: all }, null, 2);
      },
      /** Returns the number of days imported, or throws on invalid input. */
      importJSON: (text) => {
        const parsed = JSON.parse(text);
        const clean = sanitizeOverrides(parsed);
        const count = Object.keys(clean).length;
        if (!count) throw new Error('No valid days found in that file.');
        persist({ ...overrides, ...clean });
        return count;
      },
    }),
    [days, overrides, persist]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used inside ContentProvider');
  return ctx;
}
