import { useRef, useState } from 'react';
import PhotoFrame from './PhotoFrame.jsx';

/** Swipeable gallery of polaroids (CSS scroll-snap, no library). */
export default function PhotoGallery({ photos = [] }) {
  const [index, setIndex] = useState(0);
  const track = useRef(null);
  if (photos.length === 1) return <PhotoFrame photo={photos[0]} tilt={-1.5} eager />;

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index) setIndex(i);
  };
  const go = (i) => track.current?.scrollTo({ left: i * track.current.clientWidth, behavior: 'smooth' });

  return (
    <div className="gallery" aria-roledescription="carousel" aria-label="Photos">
      <div className="gallery__track" ref={track} onScroll={onScroll} tabIndex={0}>
        {photos.map((p, i) => (
          <div className="gallery__slide" key={i} aria-label={`Photo ${i + 1} of ${photos.length}`} role="group">
            <PhotoFrame photo={p} tilt={i % 2 ? 1.2 : -1.4} eager={i === 0} />
          </div>
        ))}
      </div>
      <div className="gallery__dots">
        {photos.map((_, i) => (
          <button
            key={i}
            className={`gallery__dot ${i === index ? 'is-active' : ''}`}
            aria-label={`Show photo ${i + 1}`}
            aria-current={i === index}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </div>
  );
}
