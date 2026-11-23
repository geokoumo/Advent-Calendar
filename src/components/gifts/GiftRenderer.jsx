import LetterView from './LetterView.jsx';
import PhotoMemory from './PhotoMemory.jsx';
import VideoGift from './VideoGift.jsx';
import SongGift from './SongGift.jsx';
import RealGift from './RealGift.jsx';
import CouponGift from './CouponGift.jsx';
import DateGift from './DateGift.jsx';
import GameGift from './GameGift.jsx';
import SecretMessage from './SecretMessage.jsx';
import DreamGift from './DreamGift.jsx';
import ReasonsGift from './ReasonsGift.jsx';
import FinaleGift from './FinaleGift.jsx';
import { MICROCOPY } from '../../data/config.js';

const RENDERERS = {
  letter: LetterView,
  photo: PhotoMemory,
  video: VideoGift,
  song: SongGift,
  gift: RealGift,
  coupon: CouponGift,
  date: DateGift,
  game: GameGift,
  secret: SecretMessage,
  dream: DreamGift,
  reasons: ReasonsGift,
  finale: FinaleGift,
};

/** Chooses the right experience for an entry. Unknown/missing content degrades gently. */
export default function GiftRenderer({ entry }) {
  const Component = RENDERERS[entry.type];
  if (!Component || !entry.content) {
    return <p className="gift-intro gift-missing">{MICROCOPY.missingContent}</p>;
  }
  return <Component content={entry.content} day={entry.day} />;
}
