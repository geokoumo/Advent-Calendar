import { useState } from 'react';
import { Camera } from 'lucide-react';
import { MICROCOPY } from '../data/config.js';

/**
 * A photo in a physical-feeling frame.
 * variant: 'polaroid' | 'film' | 'plain'
 * When `photo.src` is empty or fails to load, a designed placeholder is shown.
 */
export default function PhotoFrame({ photo, variant = 'polaroid', tilt = 0, ratio = '4 / 5', className = '', eager = false, showCaption = true }) {
  const [status, setStatus] = useState(photo?.src ? 'loading' : 'missing');
  const missing = !photo?.src || status === 'error';

  return (
    <figure className={`photo photo--${variant} ${className}`} style={{ '--tilt': `${tilt}deg` }}>
      <div className="photo__window" style={{ aspectRatio: ratio }}>
        {missing ? (
          <div className="photo__placeholder" role="img" aria-label={photo?.alt || MICROCOPY.missingImage}>
            <span className="photo__bokeh" aria-hidden="true" />
            <Camera size={22} strokeWidth={1.3} aria-hidden="true" />
            <span className="photo__placeholder-label">{MICROCOPY.missingImage}</span>
          </div>
        ) : (
          <img
            src={photo.src}
            alt={photo.alt || photo.caption || ''}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            className={status === 'loaded' ? 'is-loaded' : ''}
            onLoad={() => setStatus('loaded')}
            onError={() => setStatus('error')}
          />
        )}
      </div>
      {showCaption && (photo?.caption || photo?.date) && (
        <figcaption className="photo__caption">
          {photo.caption && <span className="photo__caption-text">{photo.caption}</span>}
          {photo.date && <span className="photo__date">{photo.date}</span>}
        </figcaption>
      )}
    </figure>
  );
}
