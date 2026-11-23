/**
 * Developer preview tools are compiled in ONLY when:
 *   • running `npm run dev`, or
 *   • building with VITE_ENABLE_DEV_TOOLS=true (never do this for her deployment).
 * In a normal production build this is `false` and every dev branch is
 * stripped from the bundle, so she cannot reach them.
 */
export const DEV_TOOLS_ENABLED = import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true';

const DEV_KEY = '25dol:dev';

export function readDevSettings() {
  if (!DEV_TOOLS_ENABLED) return { date: null, bypassLocks: false };
  try {
    const raw = JSON.parse(localStorage.getItem(DEV_KEY) || '{}');
    return { date: typeof raw.date === 'string' ? raw.date : null, bypassLocks: !!raw.bypassLocks };
  } catch {
    return { date: null, bypassLocks: false };
  }
}

export function writeDevSettings(next) {
  if (!DEV_TOOLS_ENABLED) return;
  try {
    localStorage.setItem(DEV_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}
