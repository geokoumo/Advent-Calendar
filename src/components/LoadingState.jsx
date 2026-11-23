export default function LoadingState({ label = 'Wrapping…' }) {
  return (
    <div className="loading" role="status">
      <span className="loading__dot" />
      <span className="loading__dot" />
      <span className="loading__dot" />
      <span className="visually-hidden">{label}</span>
    </div>
  );
}
