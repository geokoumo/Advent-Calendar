import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import Modal from './Modal.jsx';
import Button from './Button.jsx';
import { useAuth } from '../auth/AuthContext.jsx';
import { useAppState } from '../hooks/useAppState.jsx';
import { InstallSteps, isStandalone } from './InstallHint.jsx';
import { Divider } from './decor/Decor.jsx';

function Toggle({ id, label, hint, checked, onChange, disabled }) {
  return (
    <label className="toggle" htmlFor={id}>
      <span className="toggle__text">
        <span className="toggle__label">{label}</span>
        {hint && <span className="toggle__hint">{hint}</span>}
      </span>
      <input id={id} type="checkbox" role="switch" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span className="toggle__switch" aria-hidden="true" />
    </label>
  );
}

export default function SettingsSheet({ open, onClose }) {
  const { state, actions, reducedMotion, mode } = useAppState();
  const { logout, setAdminMode } = useAuth();
  const navigate = useNavigate();
  const signOut = async () => {
    onClose();
    if (mode === 'gina-view') {
      // Admin testing as Gina: simulate her signing out without ending the admin session.
      setAdminMode(null);
      navigate('/admin/login-preview');
      return;
    }
    await logout();
    navigate('/login', { replace: true });
  };
  const systemReduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  return (
    <Modal open={open} onClose={onClose} labelledBy="settings-title" className="settings">
      <p className="eyebrow">Little preferences</p>
      <h2 id="settings-title" className="settings__title">Make it cosy</h2>
      <div className="settings__list">
        <Toggle
          id="pref-motion"
          label="Calmer animations"
          hint={systemReduce ? 'Already on — your device prefers reduced motion.' : 'Fewer moving things, instant reveals.'}
          checked={reducedMotion}
          disabled={systemReduce}
          onChange={(v) => actions.setPreference('reducedMotion', v)}
        />
        <Toggle
          id="pref-snow"
          label="Snowfall"
          hint="Gentle snow in the background."
          checked={state.preferences.snow && !reducedMotion}
          disabled={reducedMotion}
          onChange={(v) => actions.setPreference('snow', v)}
        />
      </div>
      {!isStandalone() && (
        <>
          <Divider />
          <p className="settings__subtitle">Add to your Home Screen</p>
          <InstallSteps />
        </>
      )}
      <p className="settings__note">Everything you open is saved on this phone only. Nothing is shared, nothing is tracked.</p>
      <Button variant="text" icon={LogOut} onClick={signOut} className="settings__signout">Sign out</Button>
    </Modal>
  );
}
