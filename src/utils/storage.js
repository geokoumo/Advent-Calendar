/**
 * Versioned, defensive LocalStorage persistence.
 * - Corrupted JSON → start fresh (old data is kept under a backup key).
 * - Missing fields → filled from defaults.
 * - Newer schema than this build understands → read what we can, never crash.
 */
export const STORAGE_KEY = '25dol:state';
export const STORAGE_VERSION = 1;

export const DEFAULT_STATE = Object.freeze({
  version: STORAGE_VERSION,
  openedDays: [], // [day numbers]
  openedAt: {}, // { [day]: ISO string }
  completedInteractions: {}, // { [key]: true | value }
  redeemedCoupons: {}, // { [couponId]: ISO string }
  chosenCoupons: {}, // { [day]: couponId }  (for "choose one" coupons)
  rsvps: {}, // { [day]: ISO string }
  favoriteMessages: [], // [message ids]
  recentMessages: [], // last few shown, to avoid repeats
  discoveredEasterEggs: [], // [egg ids]
  finaleCompleted: false,
  preferences: { reducedMotion: false, snow: true },
});

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
const numArr = (v) => (Array.isArray(v) ? [...new Set(v.map(Number).filter((n) => Number.isInteger(n) && n >= 1 && n <= 25))] : []);
const strArr = (v) => (Array.isArray(v) ? [...new Set(v.filter((s) => typeof s === 'string'))] : []);
const obj = (v) => (isObj(v) ? v : {});

export function sanitize(raw) {
  if (!isObj(raw)) return { ...DEFAULT_STATE, preferences: { ...DEFAULT_STATE.preferences } };
  return {
    version: STORAGE_VERSION,
    openedDays: numArr(raw.openedDays).sort((a, b) => a - b),
    openedAt: obj(raw.openedAt),
    completedInteractions: obj(raw.completedInteractions),
    redeemedCoupons: obj(raw.redeemedCoupons),
    chosenCoupons: obj(raw.chosenCoupons),
    rsvps: obj(raw.rsvps),
    favoriteMessages: strArr(raw.favoriteMessages),
    recentMessages: strArr(raw.recentMessages).slice(-8),
    discoveredEasterEggs: strArr(raw.discoveredEasterEggs),
    finaleCompleted: !!raw.finaleCompleted,
    preferences: {
      reducedMotion: !!obj(raw.preferences).reducedMotion,
      snow: obj(raw.preferences).snow !== false,
    },
  };
}

export function loadState() {
  let text = null;
  try {
    text = localStorage.getItem(STORAGE_KEY);
  } catch {
    return sanitize(null); // storage unavailable (private mode etc.)
  }
  if (!text) return sanitize(null);
  try {
    const parsed = JSON.parse(text);
    // Future versions: we keep reading known fields; unknown ones are ignored.
    return sanitize(parsed);
  } catch {
    try {
      localStorage.setItem(`${STORAGE_KEY}:corrupt-backup`, text);
    } catch {
      /* ignore */
    }
    return sanitize(null);
  }
}

let lastWritten = null;
export function saveState(state) {
  const text = JSON.stringify(state);
  if (text === lastWritten) return; // avoid redundant writes
  try {
    localStorage.setItem(STORAGE_KEY, text);
    lastWritten = text;
  } catch {
    /* quota / private mode — progress lives in memory for this session */
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  lastWritten = null;
}

export const normalizeAnswer = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');
