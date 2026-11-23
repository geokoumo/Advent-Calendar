import { useState } from 'react';
import { Play, VideoOff } from 'lucide-react';
import { MICROCOPY } from '../../data/config.js';

/**
 * Local mp4 → native controls, never autoplays.
 * Embed URL → only loaded after a tap (no third-party request until then).
 * Returns null when no video is configured.
 */
export default function VideoPlayer({ video }) {
  const [error, setError] = useState(false);
  const [embedLoaded, setEmbedLoaded] = useState(false);
  if (!video || (!video.src && !video.embed)) return null;

  return (
    <figure className="video">
      <div className="video__frame">
        {error ? (
          <div className="video__error" role="status">
            <VideoOff size={22} strokeWidth={1.4} aria-hidden="true" />
            <p>{MICROCOPY.videoError}</p>
          </div>
        ) : video.src ? (
          <video
            src={video.src}
            poster={video.poster || undefined}
            controls
            playsInline
            preload="metadata"
            onError={() => setError(true)}
          >
            {video.caption}
          </video>
        ) : embedLoaded ? (
          <iframe
            src={`${video.embed}${video.embed.includes('?') ? '&' : '?'}autoplay=1&rel=0`}
            title={video.caption || 'Video message'}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button className="video__poster" onClick={() => setEmbedLoaded(true)}>
            <span className="video__play"><Play size={26} strokeWidth={1.4} aria-hidden="true" /></span>
            <span>Play the video</span>
          </button>
        )}
      </div>
      {video.caption && <figcaption className="video__caption">{video.caption}</figcaption>}
    </figure>
  );
}
