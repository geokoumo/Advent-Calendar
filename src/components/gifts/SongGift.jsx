import { useState } from 'react';
import { ExternalLink, Music2, Play } from 'lucide-react';
import Button from '../Button.jsx';

export default function SongGift({ content }) {
  const [embed, setEmbed] = useState(false);
  const isPlaylist = Array.isArray(content.tracks) && content.tracks.length > 0;
  return (
    <div className="song">
      <div className="song__record reveal" aria-hidden="true">
        <div className={`song__vinyl ${embed ? 'is-spinning' : ''}`}>
          <div className="song__label"><Music2 size={18} strokeWidth={1.4} /></div>
        </div>
        <div className="song__sleeve" />
      </div>
      <div className="song__meta reveal reveal-2">
        <p className="eyebrow">{isPlaylist ? 'A playlist' : 'Your song'}</p>
        <h2 className="song__title">{content.song}</h2>
        <p className="song__artist">{content.artist}</p>
      </div>
      {content.lyric && <blockquote className="song__lyric reveal reveal-3">{content.lyric}</blockquote>}
      <div className="song__why reveal reveal-3">
        {(content.why || []).map((p, i) => <p key={i}>{p}</p>)}
      </div>
      {isPlaylist && (
        <ol className="tracklist reveal reveal-4">
          {content.tracks.map((t, i) => (
            <li key={i} className="tracklist__item">
              <span className="tracklist__num">{String(i + 1).padStart(2, '0')}</span>
              <span className="tracklist__text">
                <span className="tracklist__title">{t.title}</span>
                <span className="tracklist__artist">{t.artist}{t.note ? ` — ${t.note}` : ''}</span>
              </span>
            </li>
          ))}
        </ol>
      )}
      <div className="song__actions reveal reveal-5">
        {content.embed && !embed && (
          <Button variant="gold" icon={Play} onClick={() => setEmbed(true)}>Play here</Button>
        )}
        {content.link && (
          <Button variant={content.embed ? 'ghost' : 'gold'} icon={ExternalLink} href={content.link}>
            {content.linkLabel || 'Listen'}
          </Button>
        )}
      </div>
      {embed && (
        <iframe
          className="song__embed"
          src={content.embed}
          title={`${content.song} player`}
          allow="encrypted-media; clipboard-write"
          loading="lazy"
        />
      )}
    </div>
  );
}
