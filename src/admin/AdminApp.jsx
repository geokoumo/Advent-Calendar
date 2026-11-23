import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';
import Dashboard from './Dashboard.jsx';
import DayEditor from './DayEditor.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import NotFound from '../pages/NotFound.jsx';
import { WaxSeal } from '../components/decor/Decor.jsx';
import './admin.css';

function AdminShell({ children }) {
  const { logout, session } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="admin">
      <header className="admin__bar">
        <Link to="/admin" className="admin__brand">
          <WaxSeal size={30} initial="25" />
          <span>
            <span className="admin__brand-name">25 Days of Love</span>
            <span className="admin__brand-sub">Admin · {session.displayName}</span>
          </span>
        </Link>
        <button
          className="btn btn--ghost btn--sm"
          onClick={async () => {
            await logout();
            navigate('/login', { replace: true });
          }}
        >
          <LogOut size={15} aria-hidden="true" /> <span>Log out</span>
        </button>
      </header>
      <main className="admin__main">{children}</main>
    </div>
  );
}

/** "Test the login experience": Gina's login screen without ending the admin session. */
function LoginPreview() {
  const { setAdminMode } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="admin-login-preview">
      <LoginPage
        demo
        onDemoSuccess={(s) => {
          if (s.role === 'admin') return navigate('/admin');
          setAdminMode({ mode: 'gina' });
          navigate('/');
        }}
      />
      <Link className="admin-login-preview__back" to="/admin">← Back to dashboard</Link>
    </div>
  );
}

export default function AdminApp() {
  return (
    <Routes>
      <Route path="login-preview" element={<LoginPreview />} />
      <Route index element={<AdminShell><Dashboard /></AdminShell>} />
      <Route path="day/:day" element={<AdminShell><DayEditor /></AdminShell>} />
      <Route path="*" element={<AdminShell><NotFound /></AdminShell>} />
    </Routes>
  );
}
