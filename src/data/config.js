/* ============================================================================
 *  GLOBAL SETTINGS — edit freely.
 *  Everything marked ✎ is placeholder copy meant to be replaced by you.
 * ========================================================================== */

/** The December this calendar belongs to. Day N unlocks on December N of this year. */
export const CALENDAR_YEAR = 2026;

/** ✎ Names used across the app. */
export const PEOPLE = {
  her: 'my love', // how the app addresses her, e.g. "Anna" or "my love"
  me: 'Me', // your name, used in signatures
};

export const TAGLINE = 'A little piece of us, every day.';

/** Short romantic lines rotated through footers. */
export const PHRASES = [
  'A little piece of us, every day.',
  '25 little surprises. One big love.',
  'December is a little more magical with you.',
  'Made with love. Opened by you.',
  'Every day, a new reason to smile.',
];

/**
 * ✎ Home-screen greetings.
 * `byDay` wins for a specific December date; otherwise a phase greeting is used.
 */
export const GREETINGS = {
  before: 'Something special is waiting for December.',
  byDay: {
    1: 'December is here, my love.',
    6: 'A little something, just for you.',
    12: 'Another little surprise for you.',
    18: 'One week to go. Still counting with you.',
    24: 'Christmas is almost here.',
    25: 'Merry Christmas, my love.',
  },
  early: 'Good to see you, my love.', // Dec 2–8
  middle: 'Another little surprise for you.', // Dec 9–17
  late: 'Almost there, my love.', // Dec 18–23
  after: 'Our little collection, forever yours.',
};

/** Friendly messages for gentle moments (locked days, missing content, etc). */
export const MICROCOPY = {
  locked: 'Not yet, my love. This little surprise is waiting for its day.',
  lockedBeforeDecember: 'Patience, my love. December hasn’t started yet.',
  missingImage: 'A photo belongs here',
  missingContent: 'This little surprise is still being wrapped. Check back soon.',
  videoError: 'The video is shy right now. Try again when you have a good connection.',
  offline: 'You’re offline. Anything you’ve already opened is still here.',
  emptyMemories: 'Your little collection of us is waiting to begin.',
};
