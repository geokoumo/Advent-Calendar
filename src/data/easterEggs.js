/* ============================================================================
 *  HIDDEN SURPRISES — optional, never required.
 *  Their triggers live in the UI (no hints are shown to her):
 *    star       → tap the little gold star at the top of the Home screen 5 times
 *    seal       → press & hold the wax seal on the Calendar header (~1s)
 *    milestone  → appears automatically once 10 gifts have been opened
 *    snowglobe  → after Christmas Day is opened, tap the closing heart on Day 25
 *  ✎ Edit the titles and messages freely. Keep the ids unchanged.
 * ========================================================================== */

export const EASTER_EGGS = {
  star: {
    id: 'star',
    title: 'You found the wishing star',
    message: '[PLACEHOLDER] Every wish I made this year somehow had you in it. Make one now. I’ll see what I can do.',
  },
  seal: {
    id: 'seal',
    title: 'Sealed with love',
    message: '[PLACEHOLDER] A secret for the curious: I rewrote the first letter eleven times.',
  },
  milestone: {
    id: 'milestone',
    title: 'Ten little doors',
    message: '[PLACEHOLDER] Ten days in. If you’ve smiled at least once, this whole thing was worth it.',
  },
  snowglobe: {
    id: 'snowglobe',
    title: 'One more thing',
    message: '[PLACEHOLDER] You looked even after the end. That’s exactly why I love you. See you next December.',
  },
};

export const EASTER_EGG_COUNT = Object.keys(EASTER_EGGS).length;
