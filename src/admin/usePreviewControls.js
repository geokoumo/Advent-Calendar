import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { useContent } from '../hooks/useContent.jsx';
import { clearState, copyState, forgetDay, GINA_VIEW_STORAGE_KEY, loadState, PREVIEW_STORAGE_KEY, saveState, STORAGE_KEY } from '../utils/storage.js';

export const couponIdsOf = (entry) => (entry?.content?.coupons || []).map((c) => c.id).filter(Boolean);

/**
 * Admin navigation into the experience. Every action writes ONLY to the
 * preview / gina-view sandboxes — Gina's real progress (STORAGE_KEY) is read
 * at most (to seed "View as Gina"), never written.
 */
export function usePreviewControls() {
  const navigate = useNavigate();
  const { setAdminMode } = useAuth();
  const { getDay } = useContent();

  return {
    /** Opens one day as if for the first time (opening animation + fresh interactions). */
    previewDay(day, date = null) {
      const entry = getDay(day);
      saveState(forgetDay(loadState(PREVIEW_STORAGE_KEY), day, couponIdsOf(entry)), PREVIEW_STORAGE_KEY);
      setAdminMode({ mode: 'preview', date, unlockAll: true });
      navigate(`/day/${day}`, { state: { replay: Date.now(), from: '/calendar' } });
    },
    /** Whole calendar with every door unlocked. */
    previewAll(date = null) {
      setAdminMode({ mode: 'preview', date, unlockAll: true });
      navigate('/calendar');
    },
    /** Real locking rules on a simulated date, starting from an empty preview. */
    testDate(date) {
      clearState(PREVIEW_STORAGE_KEY);
      setAdminMode({ mode: 'preview', date: date || null, unlockAll: false });
      navigate('/calendar');
    },
    /** Exactly Gina's experience: real date, real locks, a sandboxed copy of this device's progress. */
    viewAsGina() {
      copyState(STORAGE_KEY, GINA_VIEW_STORAGE_KEY);
      setAdminMode({ mode: 'gina' });
      navigate('/');
    },
    exitToDashboard() {
      clearState(GINA_VIEW_STORAGE_KEY);
      setAdminMode(null);
      navigate('/admin');
    },
  };
}
