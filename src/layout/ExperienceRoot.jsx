import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { AppStateProvider } from '../hooks/useAppState.jsx';
import { GINA_VIEW_STORAGE_KEY, PREVIEW_STORAGE_KEY, STORAGE_KEY } from '../utils/storage.js';
import AppShell from './AppShell.jsx';

/**
 * Decides WHOSE progress the calendar experience reads and writes:
 *   Gina (role user)        → her real progress, real dates, real locks
 *   admin + preview         → preview sandbox, optional simulated date / unlock-all
 *   admin + "View as Gina"  → separate sandbox seeded from this device's progress, real rules
 * An admin with no mode selected belongs on the dashboard.
 */
export default function ExperienceRoot() {
  const { isAdmin, adminMode } = useAuth();
  if (isAdmin && !adminMode) return <Navigate to="/admin" replace />;

  const mode = !isAdmin ? 'live' : adminMode.mode === 'gina' ? 'gina-view' : 'preview';
  const storageKey = { live: STORAGE_KEY, preview: PREVIEW_STORAGE_KEY, 'gina-view': GINA_VIEW_STORAGE_KEY }[mode];

  return (
    <AppStateProvider
      key={storageKey}
      mode={mode}
      storageKey={storageKey}
      simulatedDate={mode === 'preview' ? adminMode.date || null : null}
      unlockAll={mode === 'preview' && !!adminMode.unlockAll}
    >
      <AppShell />
    </AppStateProvider>
  );
}
