import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarHeart, Images, Heart as HeartIcon, Settings2 } from 'lucide-react';
import { useAppState } from '../hooks/useAppState.jsx';
import { TOTAL_DAYS } from '../data/calendar.js';
import { PHRASES, TAGLINE } from '../data/config.js';
import { getGreeting } from '../utils/greeting.js';
import ChristmasLights from '../components/ChristmasLights.jsx';
import ChristmasCountdown from '../components/ChristmasCountdown.jsx';
import DailyGiftCard from '../components/DailyGiftCard.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import InstallHint from '../components/InstallHint.jsx';
import SettingsSheet from '../components/SettingsSheet.jsx';
import { Divider, PineBranch, Star } from '../components/decor/Decor.jsx';

export default function Home() {
  const { now, phase, todayDay, state, discoverEgg } = useAppState();
  const [settings, setSettings] = useState(false);
  const [starSpin, setStarSpin] = useState(0);
  const taps = useRef({ n: 0, t: 0 });
  const opened = state.openedDays.length;
  const phrase = PHRASES[(todayDay || now.getDate()) % PHRASES.length];

  // Secret: tap the little star five times in a row.
  const tapStar = () => {
    const t = Date.now();
    taps.current.n = t - taps.current.t < 1500 ? taps.current.n + 1 : 1;
    taps.current.t = t;
    setStarSpin((s) => s + 1);
    if (taps.current.n >= 5) {
      taps.current.n = 0;
      discoverEgg('star');
    }
  };

  return (
    <div className="page home">
      <ChristmasLights className="home__lights" />
      <div className="home__topbar">
        <button className="home__star" onClick={tapStar} aria-label="A little star" style={{ '--spin': `${starSpin * 72}deg` }}>
          <Star size={18} />
        </button>
        <p className="home__wordmark">25 Days of Love</p>
        <button className="icon-btn" onClick={() => setSettings(true)} aria-label="Preferences">
          <Settings2 size={20} strokeWidth={1.4} />
        </button>
      </div>

      <section className="home__hero">
        <p className="eyebrow reveal">{now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        <h1 className="home__greeting reveal reveal-1">{getGreeting(phase, todayDay)}</h1>
        <p className="home__tagline reveal reveal-2">{TAGLINE}</p>
        <div className="reveal reveal-3"><ChristmasCountdown /></div>
      </section>

      <section className="reveal reveal-3" aria-label="Today’s surprise">
        <DailyGiftCard />
      </section>

      <section className="home__progress reveal reveal-4" aria-label="Progress">
        <p className="home__progress-text">
          <span className="home__progress-num">{opened}</span> of {TOTAL_DAYS} little surprises discovered
        </p>
        <ProgressBar value={opened} max={TOTAL_DAYS} label="Surprises discovered" />
      </section>

      <nav className="quick reveal reveal-4" aria-label="Quick access">
        <Link to="/calendar" className="quick__item quick__item--calendar">
          <CalendarHeart size={22} strokeWidth={1.3} aria-hidden="true" />
          <span className="quick__title">The Calendar</span>
          <span className="quick__sub">All 25 doors</span>
        </Link>
        <Link to="/memories" className="quick__item quick__item--memories">
          <Images size={22} strokeWidth={1.3} aria-hidden="true" />
          <span className="quick__title">Our Memories</span>
          <span className="quick__sub">{opened ? `${opened} kept` : 'Waiting to begin'}</span>
        </Link>
        <Link to="/for-you" className="quick__item quick__item--foryou">
          <HeartIcon size={22} strokeWidth={1.3} aria-hidden="true" />
          <span className="quick__title">Whenever You Need Me</span>
          <span className="quick__sub">Always open</span>
        </Link>
      </nav>

      <InstallHint />

      <footer className="home__footer">
        <PineBranch className="home__pine home__pine--l" />
        <PineBranch className="home__pine home__pine--r" flip />
        <Divider glyph="heart" />
        <p className="home__phrase">{phrase}</p>
      </footer>

      <SettingsSheet open={settings} onClose={() => setSettings(false)} />
    </div>
  );
}
