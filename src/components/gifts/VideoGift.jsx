import VideoPlayer from './VideoPlayer.jsx';
import LetterView from './LetterView.jsx';

export default function VideoGift({ content }) {
  const hasVideo = content.src || content.embed;
  return (
    <div className="video-gift">
      {content.intro && <p className="gift-intro reveal">{content.intro}</p>}
      {hasVideo ? (
        <div className="reveal reveal-2"><VideoPlayer video={content} /></div>
      ) : (
        <LetterView content={{ variant: 'note', body: content.fallbackText || [] }} />
      )}
    </div>
  );
}
