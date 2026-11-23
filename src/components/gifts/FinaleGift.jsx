import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import Button from '../Button.jsx';
import LetterView from './LetterView.jsx';
import PhotoGallery from '../PhotoGallery.jsx';
import VideoPlayer from './VideoPlayer.jsx';
import ChristmasLights from '../ChristmasLights.jsx';
import { GiftBox, Heart, Star } from '../decor/Decor.jsx';
import { useAppState } from '../../hooks/useAppState.jsx';

/** Christmas Day: a guided sequence that becomes a freely browsable keepsake once finished. */
export default function FinaleGift({ content }) {
  const { state, actions, discoverEgg, reducedMotion } = useAppState();
  const steps = useMemo(
    () =>
      [
        'greeting',
        content.letter && 'letter',
        content.photos?.length && 'photos',
        (content.video?.src || content.video?.embed) && 'video',
        content.gift && 'gift',
        'closing',
      ].filter(Boolean),
    [content]
  );
  const [index, setIndex] = useState(0);
  const [reached, setReached] = useState(state.finaleCompleted ? steps.length - 1 : 0);
  const [unwrapped, setUnwrapped] = useState(state.finaleCompleted);
  const [unwrapping, setUnwrapping] = useState(false);
  const [hearts, setHearts] = useState([]);
  const topRef = useRef(null);
  const step = steps[index];

  useEffect(() => {
    if (step === 'closing') actions.completeFinale();
    // keep the new chapter in view
    topRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const go = (i) => {
    setIndex(i);
    setReached((r) => Math.max(r, i));
  };
  const next = () => go(Math.min(index + 1, steps.length - 1));

  const tapHeart = () => {
    const id = Date.now();
    setHearts((h) => [...h.slice(-10), ...Array.from({ length: 6 }, (_, k) => ({ id: `${id}-${k}`, x: Math.random() * 120 - 60, d: k * 90 }))]);
    if (state.finaleCompleted) discoverEgg('snowglobe');
  };

  return (
    <div className="finale" ref={topRef}>
      <nav className="finale__dots" aria-label="Christmas chapters">
        {steps.map((s, i) => (
          <button
            key={s}
            className={`finale__dot ${i === index ? 'is-active' : ''}`}
            onClick={() => go(i)}
            disabled={i > reached}
            aria-label={`Chapter ${i + 1}`}
            aria-current={i === index ? 'step' : undefined}
          />
        ))}
      </nav>

      <section className={`finale__chapter finale__chapter--${step}`} key={step}>
        {step === 'greeting' && (
          <div className="finale__greeting">
            <ChristmasLights className="finale__lights" count={13} />
            <div className="finale__stars" aria-hidden="true">
              {Array.from({ length: 14 }, (_, i) => (
                <Star key={i} size={6 + (i % 4) * 3} className="finale__star" />
              ))}
            </div>
            <p className="eyebrow reveal">December 25</p>
            <h2 className="finale__title reveal reveal-1">{content.greeting}</h2>
            <p className="finale__sub reveal reveal-2">{content.subGreeting}</p>
            <p className="finale__lead reveal reveal-3">Twenty-four little doors led here. This one is the last — and the biggest.</p>
          </div>
        )}

        {step === 'letter' && <LetterView content={content.letter} variant="eve" />}

        {step === 'photos' && (
          <div>
            <p className="eyebrow finale__label reveal">This year, us</p>
            <PhotoGallery photos={content.photos} />
          </div>
        )}

        {step === 'video' && (
          <div>
            <p className="eyebrow finale__label reveal">A message for you</p>
            <VideoPlayer video={content.video} />
          </div>
        )}

        {step === 'gift' &&
          (unwrapped ? (
            <div className="real-gift__content finale__gift">
              <p className="eyebrow reveal">Your Christmas gift</p>
              <h2 className="real-gift__headline reveal reveal-1">{content.gift.headline}</h2>
              <p className="real-gift__message reveal reveal-2">{content.gift.message}</p>
              {content.gift.clue && (
                <div className="clue reveal reveal-3">
                  <MapPin size={18} strokeWidth={1.5} aria-hidden="true" />
                  <div>
                    <p className="clue__label">Where to find it</p>
                    <p className="clue__text">{content.gift.clue}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              className={`unwrap unwrap--finale ${unwrapping ? 'is-unwrapping' : ''}`}
              onClick={() => {
                setUnwrapping(true);
                setTimeout(() => setUnwrapped(true), reducedMotion ? 0 : 1000);
              }}
              aria-label="Unwrap your Christmas gift"
            >
              <GiftBox size={190} />
              <span className="unwrap__hint">Your last gift. Tap to unwrap.</span>
            </button>
          ))}

        {step === 'closing' && (
          <div className="finale__closing">
            {content.closing.map((line, i) => (
              <p
                key={i}
                className={`finale__line reveal ${i === content.closing.length - 1 ? 'is-last' : ''} ${i >= 2 && i <= 4 ? 'is-affirm' : ''}`}
                style={{ animationDelay: `${300 + i * 650}ms` }}
              >
                {line}
              </p>
            ))}
            <div className="finale__heart-wrap reveal" style={{ animationDelay: `${300 + content.closing.length * 650}ms` }}>
              <button className="finale__heart" onClick={tapHeart} aria-label="Send a heart">
                <Heart size={34} />
              </button>
              {hearts.map((h) => (
                <span key={h.id} className="finale__float" style={{ '--x': `${h.x}px`, animationDelay: `${h.d}ms` }} aria-hidden="true">
                  <Heart size={14} />
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {index < steps.length - 1 && (step !== 'gift' || unwrapped) && (
        <div className="finale__next">
          <Button variant={step === 'greeting' ? 'gold' : 'ghost'} onClick={next}>
            {step === 'greeting' ? 'Open your last door' : 'Continue'} <ArrowRight size={16} aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
  );
}
