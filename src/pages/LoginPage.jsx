import { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';
import { homeFor } from '../auth/guards.jsx';
import Snowfall from '../components/Snowfall.jsx';
import ChristmasLights from '../components/ChristmasLights.jsx';
import { WaxSeal } from '../components/decor/Decor.jsx';
import { TAGLINE } from '../data/config.js';

const MESSAGES = {
  missing_user: 'Tell me who you are first.',
  missing_password: 'And the little password, please.',
  invalid_credentials: 'That doesn’t look quite right. Try again?',
  generic: 'Something went wrong. Please try once more.',
};

/**
 * The entrance. `demo` (admin "test the login experience"): credentials are
 * checked but the admin's own session is left untouched.
 */
export default function LoginPage({ demo = false, onDemoSuccess }) {
  const { session, login, verify } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [field, setField] = useState(null);
  const [shake, setShake] = useState(false);
  const userRef = useRef(null);
  const passRef = useRef(null);

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  if (session && !demo) return <Navigate to={homeFor(session)} replace />;

  const fail = (code, which) => {
    setError(MESSAGES[code] || MESSAGES.generic);
    setField(which);
    setShake(true);
    setTimeout(() => setShake(false), 460);
    (which === 'password' ? passRef : userRef).current?.focus();
  };

  const submit = async (e) => {
    e.preventDefault(); // Enter in either field submits
    if (loading) return;
    if (!username.trim()) return fail('missing_user', 'username');
    if (!password) return fail('missing_password', 'password');
    setLoading(true);
    setError(null);
    setField(null);
    try {
      if (demo) {
        const s = await verify(username, password);
        onDemoSuccess?.(s);
        return;
      }
      const s = await login(username, password);
      const from = location.state?.from;
      navigate(s.role === 'admin' ? '/admin' : from && !from.startsWith('/admin') && from !== '/login' ? from : '/', { replace: true });
    } catch (err) {
      setLoading(false);
      setPassword('');
      fail(err?.code === 'missing_fields' ? 'missing_user' : err?.code || 'generic', 'password');
    }
  };

  return (
    <div className="login">
      <Snowfall />
      <ChristmasLights className="login__lights" />
      <main className="login__inner">
        {demo && <p className="login__demo" role="note">Test mode · your admin session is not affected</p>}
        <div className="login__seal reveal"><WaxSeal size={74} initial="25" /></div>
        <p className="eyebrow reveal reveal-1">A Christmas gift</p>
        <h1 className="login__title reveal reveal-1">25 Days of Love</h1>
        <p className="login__tagline reveal reveal-2">{TAGLINE}</p>

        <form className={`login__card reveal reveal-3 ${shake ? 'is-shaking' : ''}`} onSubmit={submit} noValidate>
          <label className="login__label" htmlFor="login-user">Name</label>
          <div className={`login__field ${field === 'username' ? 'has-error' : ''}`}>
            <input
              id="login-user"
              ref={userRef}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              enterKeyHint="next"
              placeholder="Your name"
              aria-invalid={field === 'username'}
              aria-describedby={error ? 'login-error' : undefined}
              disabled={loading}
            />
          </div>

          <label className="login__label" htmlFor="login-pass">Password</label>
          <div className={`login__field ${field === 'password' ? 'has-error' : ''}`}>
            <input
              id="login-pass"
              ref={passRef}
              type={show ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              enterKeyHint="go"
              placeholder="Our little secret"
              aria-invalid={field === 'password'}
              aria-describedby={error ? 'login-error' : undefined}
              disabled={loading}
            />
            <button
              type="button"
              className="login__eye"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? 'Hide password' : 'Show password'}
              aria-pressed={show}
            >
              {show ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
            </button>
          </div>

          <p id="login-error" className="login__error" role="alert" aria-live="assertive">{error || ' '}</p>

          <button type="submit" className="btn btn--gold login__submit" disabled={loading} aria-busy={loading}>
            {loading ? (
              <span className="login__loading" aria-label="Opening">
                <span /><span /><span />
              </span>
            ) : (
              <>
                <LogIn size={18} strokeWidth={1.6} aria-hidden="true" />
                <span>Open my calendar</span>
              </>
            )}
          </button>
        </form>
        <p className="login__footer reveal reveal-4">Made with love, just for you.</p>
      </main>
    </div>
  );
}
