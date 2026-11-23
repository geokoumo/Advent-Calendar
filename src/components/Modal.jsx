import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/** Bottom sheet on mobile, centred card on larger screens. */
export default function Modal({ open, onClose, title, children, className = '', labelledBy, hideClose }) {
  const ref = useRef(null);
  const lastFocus = useRef(null);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement;
    const el = ref.current;
    const focusables = () => el?.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])') || [];
    requestAnimationFrame(() => (focusables()[0] || el)?.focus());
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
      if (e.key === 'Tab') {
        const f = [...focusables()];
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      lastFocus.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div className="modal" onClick={onClose}>
      <div
        ref={ref}
        className={`modal__panel ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={labelledBy ? undefined : title}
        aria-labelledby={labelledBy}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="modal__grip" aria-hidden="true" />
        {!hideClose && (
          <button className="modal__close" onClick={onClose} aria-label="Close">
            <X size={20} strokeWidth={1.5} />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}
