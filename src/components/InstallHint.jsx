import { useEffect, useState } from 'react';
import { Share, PlusSquare, X } from 'lucide-react';
import Button from './Button.jsx';

const KEY = '25dol:install-hint-dismissed';

export const isStandalone = () =>
  (typeof matchMedia !== 'undefined' && matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;

export const isIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

/** Install steps, reused by the settings sheet. */
export function InstallSteps() {
  if (isIOS()) {
    return (
      <ol className="install-steps">
        <li>Tap <Share size={15} aria-label="Share" className="inline-icon" /> <strong>Share</strong> in Safari’s toolbar.</li>
        <li>Choose <PlusSquare size={15} aria-hidden="true" className="inline-icon" /> <strong>Add to Home Screen</strong>.</li>
        <li>Open <em>25 Days</em> from your Home Screen every morning.</li>
      </ol>
    );
  }
  return (
    <ol className="install-steps">
      <li>Open your browser’s menu.</li>
      <li>Choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>
    </ol>
  );
}

/** A small, dismissible card on Home — only shown in the browser, never in the installed app. */
export default function InstallHint() {
  const [deferred, setDeferred] = useState(() => window.__dolInstallPrompt || null);
  const [hidden, setHidden] = useState(() => {
    try {
      return isStandalone() || localStorage.getItem(KEY) === '1';
    } catch {
      return isStandalone();
    }
  });

  useEffect(() => {
    const onPrompt = () => setDeferred(window.__dolInstallPrompt);
    window.addEventListener('dol:installprompt', onPrompt);
    return () => window.removeEventListener('dol:installprompt', onPrompt);
  }, []);

  if (hidden) return null;
  const dismiss = () => {
    try {
      localStorage.setItem(KEY, '1');
    } catch {
      /* ignore */
    }
    setHidden(true);
  };

  return (
    <aside className="install-hint reveal reveal-5" aria-label="Add to Home Screen">
      <button className="install-hint__close" onClick={dismiss} aria-label="Dismiss">
        <X size={16} strokeWidth={1.5} />
      </button>
      <p className="eyebrow">Keep it close</p>
      <p className="install-hint__title">Add this little calendar to your Home Screen.</p>
      {deferred ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={async () => {
            deferred.prompt();
            await deferred.userChoice.catch(() => {});
            window.__dolInstallPrompt = null;
            dismiss();
          }}
        >
          Install
        </Button>
      ) : (
        <InstallSteps />
      )}
    </aside>
  );
}
