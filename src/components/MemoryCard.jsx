import { Link } from 'react-router-dom';
import { Mail, Music, Gift, Ticket, Sparkles, KeyRound, Film, MapPin, ListChecks, Star as StarIcon, Puzzle } from 'lucide-react';
import PhotoFrame from './PhotoFrame.jsx';

const TYPE_META = {
  letter: { label: 'Letter', icon: Mail },
  photo: { label: 'Memory', icon: StarIcon },
  video: { label: 'Video', icon: Film },
  song: { label: 'Song', icon: Music },
  gift: { label: 'Gift', icon: Gift },
  coupon: { label: 'Coupon', icon: Ticket },
  date: { label: 'Date', icon: MapPin },
  game: { label: 'Game', icon: Puzzle },
  secret: { label: 'Secret', icon: KeyRound },
  dream: { label: 'Dream', icon: Sparkles },
  reasons: { label: 'Reasons', icon: ListChecks },
  finale: { label: 'Christmas', icon: Sparkles },
};

export const typeMeta = (type) => TYPE_META[type] || TYPE_META.letter;

/** First photo attached to an entry (for photo-style memory cards). */
export function entryImage(entry) {
  const c = entry.content || {};
  if (entry.memory && typeof entry.memory === 'object' && 'image' in entry.memory) return entry.memory.image;
  return c.photos?.[0] || c.photo || c.image || null;
}

function excerpt(entry) {
  if (entry.memory?.description) return entry.memory.description;
  const c = entry.content || {};
  const text = c.story || c.body?.[0] || c.why?.[0] || c.intro || c.message?.[0] || c.note || entry.teaser || '';
  return text.replace(/^\[PLACEHOLDER\]\s*/, '');
}

/** Scrapbook card. Style varies by content type, so the collection never looks uniform. */
export default function MemoryCard({ entry, openedAt, index }) {
  const meta = typeMeta(entry.type);
  const Icon = meta.icon;
  const image = entryImage(entry);
  const tilt = [-1.6, 1.1, -0.6, 1.8, -1.2][index % 5];
  const style = image ? 'photo' : entry.type === 'letter' || entry.type === 'secret' ? 'paper' : entry.type === 'coupon' || entry.type === 'date' ? 'ticket' : entry.type === 'finale' ? 'finale' : 'card';
  const date = openedAt ? new Date(openedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : null;

  return (
    <Link
      to={`/day/${entry.day}`}
      state={{ from: '/memories' }}
      className={`memory memory--${style}`}
      style={{ '--tilt': `${tilt}deg`, animationDelay: `${Math.min(index * 60, 600)}ms` }}
      aria-label={`Day ${entry.day}: ${entry.title}. ${meta.label}.`}
    >
      {style === 'photo' && <PhotoFrame photo={image} variant="polaroid" ratio="1 / 1" showCaption={false} />}
      <div className="memory__body">
        <p className="memory__meta">
          <Icon size={12} strokeWidth={1.6} aria-hidden="true" />
          <span>Day {entry.day} · {meta.label}</span>
        </p>
        <h3 className="memory__title">{entry.title}</h3>
        {style !== 'photo' && <p className="memory__excerpt">{excerpt(entry)}</p>}
        {date && <p className="memory__date">Opened {date}</p>}
      </div>
    </Link>
  );
}
