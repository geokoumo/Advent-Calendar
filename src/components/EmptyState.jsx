import { WaxSeal } from './decor/Decor.jsx';

export default function EmptyState({ title, children, action }) {
  return (
    <div className="empty reveal">
      <div className="empty__envelope" aria-hidden="true">
        <div className="empty__flap" />
        <WaxSeal size={48} className="empty__seal" />
      </div>
      <h2 className="empty__title">{title}</h2>
      {children && <p className="empty__text">{children}</p>}
      {action}
    </div>
  );
}
