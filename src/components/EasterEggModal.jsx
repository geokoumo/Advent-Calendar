import { useAppState } from '../hooks/useAppState.jsx';
import Modal from './Modal.jsx';
import Button from './Button.jsx';
import { Star } from './decor/Decor.jsx';

export default function EasterEggModal() {
  const { activeEgg, closeEgg } = useAppState();
  return (
    <Modal open={!!activeEgg} onClose={closeEgg} labelledBy="egg-title" className="egg">
      {activeEgg && (
        <>
          <div className="egg__sparkles" aria-hidden="true">
            {Array.from({ length: 9 }, (_, i) => (
              <Star key={i} size={8 + (i % 3) * 4} className={`egg__spark egg__spark--${i}`} />
            ))}
          </div>
          <p className="eyebrow">A little secret</p>
          <h2 id="egg-title" className="egg__title">{activeEgg.title}</h2>
          <p className="egg__message">{activeEgg.message}</p>
          <Button variant="gold" onClick={closeEgg}>Keep it safe</Button>
        </>
      )}
    </Modal>
  );
}
