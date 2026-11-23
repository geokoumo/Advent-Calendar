import { NavLink } from 'react-router-dom';
import { Home, CalendarHeart, Images, Heart } from 'lucide-react';

const ITEMS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/calendar', label: 'Calendar', icon: CalendarHeart },
  { to: '/memories', label: 'Memories', icon: Images },
  { to: '/for-you', label: 'For You', icon: Heart },
];

export default function BottomNavigation() {
  return (
    <nav className="bottom-nav" aria-label="Main">
      <ul>
        {ITEMS.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink to={to} end={end} className={({ isActive }) => `bottom-nav__link ${isActive ? 'is-active' : ''}`}>
              <Icon size={21} strokeWidth={1.5} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
