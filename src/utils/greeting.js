import { GREETINGS } from '../data/config.js';

export function getGreeting(phase, todayDay) {
  if (phase === 'before') return GREETINGS.before;
  if (phase === 'after') return GREETINGS.after;
  if (GREETINGS.byDay[todayDay]) return GREETINGS.byDay[todayDay];
  if (todayDay <= 8) return GREETINGS.early;
  if (todayDay <= 17) return GREETINGS.middle;
  return GREETINGS.late;
}
