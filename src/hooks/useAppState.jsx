import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { clearState, forgetDay, loadState, sanitize, saveState, STORAGE_KEY } from '../utils/storage.js';
import { getNow, getPhase, getTodayDay, isDayUnlocked, msUntilMidnight } from '../utils/date.js';
import { DEV_TOOLS_ENABLED, readDevSettings } from '../utils/devFlags.js';
import { EASTER_EGGS } from '../data/easterEggs.js';

const AppStateContext = createContext(null);

const addUnique = (arr, v) => (arr.includes(v) ? arr : [...arr, v]);

function reducer(state, action) {
  switch (action.type) {
    case 'openDay': {
      if (state.openedDays.includes(action.day)) return state; // reopening never duplicates
      return {
        ...state,
        openedDays: [...state.openedDays, action.day].sort((a, b) => a - b),
        openedAt: { ...state.openedAt, [action.day]: new Date().toISOString() },
      };
    }
    case 'complete':
      if (state.completedInteractions[action.key] === (action.value ?? true)) return state;
      return { ...state, completedInteractions: { ...state.completedInteractions, [action.key]: action.value ?? true } };
    case 'redeem':
      if (state.redeemedCoupons[action.id]) return state;
      return { ...state, redeemedCoupons: { ...state.redeemedCoupons, [action.id]: new Date().toISOString() } };
    case 'choose':
      if (state.chosenCoupons[action.day]) return state; // a choice is final
      return { ...state, chosenCoupons: { ...state.chosenCoupons, [action.day]: action.id } };
    case 'rsvp':
      if (state.rsvps[action.day]) return state;
      return { ...state, rsvps: { ...state.rsvps, [action.day]: new Date().toISOString() } };
    case 'toggleFavorite': {
      const has = state.favoriteMessages.includes(action.id);
      return {
        ...state,
        favoriteMessages: has ? state.favoriteMessages.filter((x) => x !== action.id) : [...state.favoriteMessages, action.id],
      };
    }
    case 'seenMessage':
      return { ...state, recentMessages: [...state.recentMessages.filter((x) => x !== action.id), action.id].slice(-8) };
    case 'discoverEgg':
      if (state.discoveredEasterEggs.includes(action.id)) return state;
      return { ...state, discoveredEasterEggs: addUnique(state.discoveredEasterEggs, action.id) };
    case 'finale':
      return state.finaleCompleted ? state : { ...state, finaleCompleted: true };
    case 'pref':
      return { ...state, preferences: { ...state.preferences, [action.key]: action.value } };
    case 'forgetDay':
      return forgetDay(state, action.day, action.couponIds);
    case 'reset':
      return sanitize(null);
    default:
      return state;
  }
}

/** `simulatedDate` ('YYYY-MM-DD') is only passed in admin preview. */
function computeNow(simulatedDate) {
  const m = simulatedDate && /^(\d{4})-(\d{2})-(\d{2})$/.exec(simulatedDate);
  if (!m) return getNow();
  const real = new Date();
  return new Date(+m[1], +m[2] - 1, +m[3], real.getHours(), real.getMinutes(), real.getSeconds());
}

function useClock(simulatedDate) {
  const [now, setNow] = useState(() => computeNow(simulatedDate));
  useEffect(() => {
    let timer;
    const refresh = () => setNow(computeNow(simulatedDate));
    refresh();
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        refresh();
        schedule();
      }, msUntilMidnight());
    };
    schedule();
    const onVisible = () => document.visibilityState === 'visible' && refresh();
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', refresh);
    window.addEventListener('dol:dev-change', refresh);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('dol:dev-change', refresh);
    };
  }, [simulatedDate]);
  return now;
}

function useSystemReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)';
  const [reduce, setReduce] = useState(() => typeof matchMedia !== 'undefined' && matchMedia(query).matches);
  useEffect(() => {
    if (typeof matchMedia === 'undefined') return;
    const mq = matchMedia(query);
    const fn = (e) => setReduce(e.matches);
    mq.addEventListener?.('change', fn);
    return () => mq.removeEventListener?.('change', fn);
  }, []);
  return reduce;
}

/**
 * mode:          'live' (Gina's real progress) | 'preview' | 'gina-view' (admin sandboxes)
 * storageKey:    where progress is persisted — sandboxes use their own key, so
 *                they can never touch the real progress.
 * simulatedDate: admin preview only.
 * unlockAll:     admin preview only — bypasses date locks.
 */
export function AppStateProvider({ children, mode = 'live', storageKey = STORAGE_KEY, simulatedDate = null, unlockAll = false }) {
  const [state, dispatch] = useReducer(reducer, storageKey, loadState);
  const now = useClock(simulatedDate);
  const systemReduce = useSystemReducedMotion();
  const [toastMsg, setToastMsg] = useState(null);
  const [activeEgg, setActiveEgg] = useState(null);
  const toastTimer = useRef();

  useEffect(() => saveState(state, storageKey), [state, storageKey]);

  const reducedMotion = systemReduce || state.preferences.reducedMotion;
  useEffect(() => {
    document.documentElement.dataset.motion = reducedMotion ? 'reduce' : 'full';
  }, [reducedMotion]);

  const toast = useCallback((message) => {
    clearTimeout(toastTimer.current);
    setToastMsg({ message, key: Date.now() });
    toastTimer.current = setTimeout(() => setToastMsg(null), 3400);
  }, []);

  const discoverEgg = useCallback(
    (id) => {
      if (!EASTER_EGGS[id]) return;
      dispatch({ type: 'discoverEgg', id });
      setActiveEgg(EASTER_EGGS[id]);
    },
    [dispatch]
  );

  // Easter egg: unlocked automatically after ten gifts have been opened.
  useEffect(() => {
    if (state.openedDays.length >= 10 && !state.discoveredEasterEggs.includes('milestone')) {
      const t = setTimeout(() => discoverEgg('milestone'), 2200);
      return () => clearTimeout(t);
    }
  }, [state.openedDays.length, state.discoveredEasterEggs, discoverEgg]);

  const phase = getPhase(now);
  const bypassLocks = DEV_TOOLS_ENABLED && readDevSettings().bypassLocks;

  const value = useMemo(
    () => ({
      state,
      mode,
      now,
      phase,
      todayDay: getTodayDay(now),
      // After the finale, everything stays open forever (even if the clock is wrong).
      isUnlocked: (day) => unlockAll || bypassLocks || state.finaleCompleted || isDayUnlocked(day, now),
      isOpened: (day) => state.openedDays.includes(day),
      reducedMotion,
      toast,
      toastMsg,
      activeEgg,
      closeEgg: () => setActiveEgg(null),
      discoverEgg,
      actions: {
        openDay: (day) => dispatch({ type: 'openDay', day }),
        complete: (key, value) => dispatch({ type: 'complete', key, value }),
        redeem: (id) => dispatch({ type: 'redeem', id }),
        choose: (day, id) => dispatch({ type: 'choose', day, id }),
        rsvp: (day) => dispatch({ type: 'rsvp', day }),
        toggleFavorite: (id) => dispatch({ type: 'toggleFavorite', id }),
        seenMessage: (id) => dispatch({ type: 'seenMessage', id }),
        completeFinale: () => dispatch({ type: 'finale' }),
        setPreference: (key, value) => dispatch({ type: 'pref', key, value }),
        forgetDay: (day, couponIds) => dispatch({ type: 'forgetDay', day, couponIds }),
        resetAll: () => {
          clearState(storageKey);
          dispatch({ type: 'reset' });
        },
      },
    }),
    [state, mode, now, phase, unlockAll, bypassLocks, reducedMotion, toast, toastMsg, activeEgg, discoverEgg, storageKey]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

/** Same as useAppState, but returns null outside the experience (e.g. on the login screen). */
export function useOptionalAppState() {
  return useContext(AppStateContext);
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
}
