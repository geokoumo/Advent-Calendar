/* ============================================================================
 *  CONTENT STORE — where admin edits to the 25 days live.
 *
 *  Effective content for a day = the first of:
 *    1. a LOCAL edit saved in the Admin panel on this device (localStorage)
 *    2. a PUBLISHED edit in src/data/content-overrides.json (bundled at build)
 *    3. the DEFAULT in src/data/calendar.js
 *
 *  Local edits only exist on the device where they were made. To ship edits
 *  to Gina's phone: Admin → "Export content", save the file as
 *  src/data/content-overrides.json, commit and redeploy.
 *
 *  The adapter below is the only code that touches storage. To move to a
 *  database later, re-implement `contentAdapter` with the same three
 *  functions (load / save / clear) backed by an API.
 * ========================================================================== */
import { DAYS } from './calendar.js';

export const CONTENT_KEY = '25dol:content';
export const CONTENT_VERSION = 1;
export const KNOWN_TYPES = ['letter', 'photo', 'video', 'song', 'gift', 'coupon', 'date', 'game', 'secret', 'dream', 'reasons', 'finale'];

// Optional, bundled at build time. Missing file → no published edits.
const published = import.meta.glob('./content-overrides.json', { eager: true, import: 'default' });
export const PUBLISHED_OVERRIDES = sanitizeOverrides(Object.values(published)[0]);

/** Keeps only well-formed day objects for days 1–25; anything else is ignored. */
export function sanitizeOverrides(raw) {
  const days = raw && typeof raw === 'object' && raw.days && typeof raw.days === 'object' ? raw.days : {};
  const out = {};
  for (const [k, v] of Object.entries(days)) {
    const day = Number(k);
    if (!Number.isInteger(day) || day < 1 || day > 25) continue;
    if (!v || typeof v !== 'object' || !KNOWN_TYPES.includes(v.type) || !v.content || typeof v.content !== 'object') continue;
    if (typeof v.title !== 'string') continue;
    out[day] = { ...v, day };
  }
  return out;
}

export const contentAdapter = {
  load() {
    try {
      const raw = JSON.parse(localStorage.getItem(CONTENT_KEY) || 'null');
      return sanitizeOverrides(raw);
    } catch {
      return {};
    }
  },
  save(overrides) {
    try {
      localStorage.setItem(CONTENT_KEY, JSON.stringify({ version: CONTENT_VERSION, updatedAt: new Date().toISOString(), days: overrides }));
      return true;
    } catch {
      return false;
    }
  },
  clear() {
    try {
      localStorage.removeItem(CONTENT_KEY);
    } catch {
      /* ignore */
    }
  },
};

export const DEFAULT_DAYS = DAYS;

export function mergeDays(localOverrides) {
  return DAYS.map((d) => localOverrides[d.day] || PUBLISHED_OVERRIDES[d.day] || d);
}
