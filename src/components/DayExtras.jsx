import { ExternalLink, Music2, Sparkles } from 'lucide-react';
import LetterView from './gifts/LetterView.jsx';
import ReasonsGift from './gifts/ReasonsGift.jsx';
import PhotoFrame from './PhotoFrame.jsx';
import Button from './Button.jsx';
import { Divider } from './decor/Decor.jsx';

const filled = (v) => typeof v === 'string' && v.trim().length > 0;
const paragraphs = (text) => (text || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

/** True when a day has at least one extra worth showing. */
export function hasExtras(x) {
  if (!x || typeof x !== 'object') return false;
  return (
    filled(x.message?.text) ||
    filled(x.song?.title) || filled(x.song?.dedication) ||
    filled(x.poem?.text) ||
    (Array.isArray(x.reasons) && x.reasons.some((r) => filled(r?.title) || filled(r?.text))) ||
    filled(x.memory?.text) || filled(x.memory?.photo) ||
    filled(x.activity?.text)
  );
}

/**
 * Optional add-ons any day can carry, on top of its main surprise:
 * extras: {
 *   message:  { title?, text, signature? }          → a handwritten note
 *   song:     { title, artist?, dedication?, link? } → a song dedication
 *   poem:     { title?, text }                       → line breaks are kept
 *   reasons:  [{ title, text }]                      → tap-to-open love reasons
 *   memory:   { text, photo?, caption? }             → a remembered moment
 *   activity: { title?, text }                       → something to do together
 * }
 */
export default function DayExtras({ extras: x }) {
  if (!hasExtras(x)) return null;
  const reasons = (x.reasons || []).filter((r) => filled(r?.title) || filled(r?.text));

  return (
    <section className="extras" aria-label="A little more">
      {filled(x.message?.text) && (
        <div className="extras__block">
          <LetterView content={{ variant: 'note', greeting: x.message.title || 'A little note', body: paragraphs(x.message.text), signature: x.message.signature }} />
        </div>
      )}

      {(filled(x.song?.title) || filled(x.song?.dedication)) && (
        <div className="extras__block extras__song reveal">
          <p className="eyebrow"><Music2 size={12} aria-hidden="true" /> A song for you</p>
          {filled(x.song.title) && <h3 className="extras__song-title">{x.song.title}</h3>}
          {filled(x.song.artist) && <p className="extras__song-artist">{x.song.artist}</p>}
          {paragraphs(x.song.dedication).map((p, i) => <p key={i} className="extras__song-dedication">{p}</p>)}
          {filled(x.song.link) && (
            <Button variant="ghost" size="sm" icon={ExternalLink} href={x.song.link}>Listen</Button>
          )}
        </div>
      )}

      {filled(x.poem?.text) && (
        <div className="extras__block extras__poem reveal">
          <Divider />
          {filled(x.poem.title) && <h3 className="extras__poem-title">{x.poem.title}</h3>}
          <p className="extras__poem-text">{x.poem.text.trim()}</p>
        </div>
      )}

      {reasons.length > 0 && (
        <div className="extras__block">
          <ReasonsGift content={{ reasons }} />
        </div>
      )}

      {(filled(x.memory?.text) || filled(x.memory?.photo)) && (
        <div className="extras__block extras__memory reveal">
          <p className="eyebrow">A memory</p>
          {filled(x.memory.photo) && (
            <PhotoFrame photo={{ src: x.memory.photo, alt: x.memory.caption || 'A memory of us', caption: x.memory.caption }} tilt={-1.2} ratio="4 / 3" />
          )}
          {paragraphs(x.memory.text).map((p, i) => <p key={i} className="extras__memory-text">{p}</p>)}
        </div>
      )}

      {filled(x.activity?.text) && (
        <div className="extras__block extras__activity reveal">
          <p className="eyebrow"><Sparkles size={12} aria-hidden="true" /> {x.activity.title || 'Something to do together'}</p>
          {paragraphs(x.activity.text).map((p, i) => <p key={i}>{p}</p>)}
        </div>
      )}
    </section>
  );
}
