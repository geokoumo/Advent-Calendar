/**
 * Versioned, defensive LocalStorage persistence.
 * - Corrupted JSON → start fresh (old data is kept under a backup key).
 * - Missing fields → filled from defaults.
 * - Newer schema than this build understands → read what we can, never crash.
 */
export const STORAGE_KEY = '25dol:state'; // Gina's real progress
export const PREVIEW_STORAGE_KEY = '25dol:preview-state'; // admin preview sandbox (never her progress)
export const GINA_VIEW_STORAGE_KEY = '25dol:gina-view-state'; // admin "View as Gina" sandbox
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

export function loadState(key = STORAGE_KEY) {
  let text = null;
  try {
    text = localStorage.getItem(key);
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
      localStorage.setItem(`${key}:corrupt-backup`, text);
    } catch {
      /* ignore */
    }
    return sanitize(null);
  }
}

const lastWritten = new Map(); // per storage key
export function saveState(state, key = STORAGE_KEY) {
  const text = JSON.stringify(state);
  if (text === lastWritten.get(key)) return; // avoid redundant writes
  try {
    localStorage.setItem(key, text);
    lastWritten.set(key, text);
  } catch {
    /* quota / private mode — progress lives in memory for this session */
  }
}

export function clearState(key = STORAGE_KEY) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
  lastWritten.delete(key);
}

/** Copies one progress namespace into another (used to seed sandboxes). */
export function copyState(fromKey, toKey) {
  saveState(loadState(fromKey), toKey);
}

/**
 * Returns `state` with one day "un-opened": the day, its interactions, RSVP,
 * coupon choice/redemptions and (for Day 25) the finale flag. Used by admin
 * preview so the opening animation and interactions can be replayed.
 */
export function forgetDay(state, day, couponIds = []) {
  const suffix = `-${day}`;
  const strip = (obj, pred) => Object.fromEntries(Object.entries(obj).filter(([k]) => !pred(k)));
  return {
    ...state,
    openedDays: state.openedDays.filter((d) => d !== day),
    openedAt: strip(state.openedAt, (k) => Number(k) === day),
    completedInteractions: strip(state.completedInteractions, (k) => k.endsWith(suffix)),
    rsvps: strip(state.rsvps, (k) => Number(k) === day),
    chosenCoupons: strip(state.chosenCoupons, (k) => Number(k) === day),
    redeemedCoupons: strip(state.redeemedCoupons, (k) => couponIds.includes(k)),
    finaleCompleted: day === 25 ? false : state.finaleCompleted,
  };
}

export const normalizeAnswer = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');
