import { useAppState } from '../hooks/useAppState.jsx';

export default function Toast() {
  const { toastMsg } = useAppState();
  return (
    <div className="toast-region" aria-live="polite" role="status">
      {toastMsg && (
        <div className="toast" key={toastMsg.key}>
          {toastMsg.message}
        </div>
      )}
    </div>
  );
}
