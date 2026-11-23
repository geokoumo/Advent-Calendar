import { CALENDAR_YEAR } from '../data/config.js';
import { DEV_TOOLS_ENABLED, readDevSettings } from './devFlags.js';

const MS_DAY = 86400000;

/** Current local time — or the developer's simulated date in dev mode. */
export function getNow() {
  if (DEV_TOOLS_ENABLED) {
    const { date } = readDevSettings();
    const m = date && /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    if (m) {
      const real = new Date();
      return new Date(+m[1], +m[2] - 1, +m[3], real.getHours(), real.getMinutes(), real.getSeconds());
    }
  }
  return new Date();
}

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const decemberDate = (day) => new Date(CALENDAR_YEAR, 11, day);

/** Whole calendar days between two dates (DST-safe). */
export function daysBetween(from, to) {
  return Math.round((startOfDay(to) - startOfDay(from)) / MS_DAY);
}

/** 'before' (prior to Dec 1) · 'during' (Dec 1–25) · 'after' (Dec 26 onwards). */
export function getPhase(now) {
  const d = startOfDay(now);
  if (d < decemberDate(1)) return 'before';
  if (d > decemberDate(25)) return 'after';
  return 'during';
}

/** Today's December day number (1–25) during the calendar, else null. */
export function getTodayDay(now) {
  return getPhase(now) === 'during' ? now.getDate() : null;
}

/** A day unlocks at local midnight on December <day> of CALENDAR_YEAR. */
export function isDayUnlocked(day, now) {
  return startOfDay(now) >= decemberDate(day);
}

export function daysUntilChristmas(now) {
  return Math.max(0, daysBetween(now, decemberDate(25)));
}

export function daysUntilDecember(now) {
  return Math.max(0, daysBetween(now, decemberDate(1)));
}

export function formatDecemberDate(day, opts = { weekday: 'long', month: 'long', day: 'numeric' }) {
  return decemberDate(day).toLocaleDateString(undefined, opts);
}

/** Milliseconds until the next local midnight (used to refresh unlocks). */
export function msUntilMidnight(now = new Date()) {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return next - now + 500;
}
