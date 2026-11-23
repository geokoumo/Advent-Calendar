import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

/** Any signed-in account. Otherwise → /login (remembering where they were going). */
export function RequireAuth({ children }) {
  const { session } = useAuth();
  const location = useLocation();
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

/** Only the given role. A signed-in user without it is sent home, never shown admin UI. */
export function RequireRole({ role, children }) {
  const { session } = useAuth();
  const location = useLocation();
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (session.role !== role) return <Navigate to="/" replace />;
  return children;
}

export const homeFor = (session) => (session?.role === 'admin' ? '/admin' : '/');
