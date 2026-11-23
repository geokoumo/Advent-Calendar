import { lazy, Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { WifiOff } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation.jsx';
import Snowfall from '../components/Snowfall.jsx';
import Toast from '../components/Toast.jsx';
import EasterEggModal from '../components/EasterEggModal.jsx';
import { MICROCOPY } from '../data/config.js';
import { DEV_TOOLS_ENABLED } from '../utils/devFlags.js';
import { useAppState } from '../hooks/useAppState.jsx';

// Only bundled when dev tools are enabled — absent from her production build.
const DevPanel = DEV_TOOLS_ENABLED ? lazy(() => import('../dev/DevPanel.jsx')) : null;
// Admin preview / View-as-Gina bars. Only rendered (and downloaded) in admin modes.
const AdminOverlay = lazy(() => import('../admin/AdminOverlay.jsx'));

function useOnline() {
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  return online;
}

export default function AppShell() {
  const location = useLocation();
  const online = useOnline();
  const { mode } = useAppState();
  const inGift = location.pathname.startsWith('/day/');

  useEffect(() => {
    if (!inGift) window.scrollTo(0, 0);
  }, [location.pathname, inGift]);

  return (
    <div className={`app ${inGift ? 'app--immersive' : ''} ${mode !== 'live' ? `app--${mode}` : ''}`}>
      <Snowfall density={inGift ? 0.5 : 1} />
      {!online && (
        <p className="offline" role="status">
          <WifiOff size={14} aria-hidden="true" /> {MICROCOPY.offline}
        </p>
      )}
      <div className="app__page" key={location.pathname}>
        <Outlet />
      </div>
      {!inGift && <BottomNavigation />}
      <Toast />
      <EasterEggModal />
      {mode !== 'live' && (
        <Suspense fallback={null}>
          <AdminOverlay />
        </Suspense>
      )}
      {DevPanel && mode === 'live' && (
        <Suspense fallback={null}>
          <DevPanel />
        </Suspense>
      )}
    </div>
  );
}
