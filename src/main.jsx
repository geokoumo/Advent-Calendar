import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/jost/400.css';
import '@fontsource/jost/500.css';
import '@fontsource/caveat/500.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/pages.css';
import './styles/gifts.css';
import App from './App.jsx';

// Capture the install prompt early (Chrome/Android); InstallHint picks it up.
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.__dolInstallPrompt = e;
  window.dispatchEvent(new Event('dol:installprompt'));
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Fade out the inline splash once React has painted.
requestAnimationFrame(() => {
  const boot = document.getElementById('boot');
  if (boot) {
    boot.style.opacity = '0';
    setTimeout(() => boot.remove(), 600);
  }
});

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
