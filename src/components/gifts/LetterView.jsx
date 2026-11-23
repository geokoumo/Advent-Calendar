import { Divider, WaxSeal } from '../decor/Decor.jsx';
import PhotoGallery from '../PhotoGallery.jsx';
import VideoPlayer from './VideoPlayer.jsx';


/** variant: 'letter' | 'note' | 'comfort' | 'eve' */
export default function LetterView({ content, variant: forced, className = '' }) {
  const variant = forced || content.variant || 'letter';
  return (
    <article className={`letter letter--${variant} ${className}`}>
      {variant !== 'note' && <WaxSeal size={52} className="letter__seal" />}
      {content.dateLine && <p className="letter__dateline">{content.dateLine}</p>}
      {content.greeting && <h2 className="letter__greeting reveal reveal-1">{content.greeting}</h2>}
      <div className="letter__body">
        {(content.body || []).map((p, i) => (
          <p key={i} className="reveal" style={{ animationDelay: `${200 + i * 140}ms` }}>
            {p}
          </p>
        ))}
      </div>
      {content.photos?.length > 0 && (
        <div className="letter__photos">
          <PhotoGallery photos={content.photos} />
        </div>
      )}
      {content.video && <VideoPlayer video={content.video} />}
      {content.signature && (
        <>
          {variant === 'eve' && <Divider glyph="heart" />}
          <p className="letter__signature reveal" style={{ animationDelay: `${300 + (content.body?.length || 0) * 140}ms` }}>
            {content.signature}
          </p>
        </>
      )}
    </article>
  );
}
