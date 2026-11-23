import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { authService } from './authService.js';
import { ROLES } from './accounts.js';

const AuthContext = createContext(null);
const MODE_KEY = '25dol:admin-mode';

/**
 * adminMode (admin only, per browser tab, survives refresh):
 *   null                                   → admin dashboard
 *   { mode: 'preview', date, unlockAll }   → ADMIN PREVIEW of the experience
 *   { mode: 'gina' }                       → View as Gina (no admin UI, real rules)
 */
function readMode() {
  try {
    const m = JSON.parse(sessionStorage.getItem(MODE_KEY) || 'null');
    return m && (m.mode === 'preview' || m.mode === 'gina') ? m : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => authService.restore());
  const [adminModeRaw, setAdminModeRaw] = useState(readMode);
  const isAdmin = session?.role === ROLES.ADMIN;
  const adminMode = isAdmin ? adminModeRaw : null; // never honoured for non-admins

  const setAdminMode = useCallback((mode) => {
    setAdminModeRaw(mode);
    try {
      if (mode) sessionStorage.setItem(MODE_KEY, JSON.stringify(mode));
      else sessionStorage.removeItem(MODE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const login = useCallback(async (username, password) => {
    const s = await authService.login(username, password);
    setSession(s);
    return s;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setAdminMode(null);
    setSession(null);
  }, [setAdminMode]);

  const value = useMemo(
    () => ({ session, isAdmin, adminMode, setAdminMode, login, logout, verify: authService.verify }),
    [session, isAdmin, adminMode, setAdminMode, login, logout]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
