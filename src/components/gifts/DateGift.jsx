import { CalendarClock, MapPin, Shirt, ShoppingBag, Check } from 'lucide-react';
import Button from '../Button.jsx';
import { useAppState } from '../../hooks/useAppState.jsx';
import { Divider } from '../decor/Decor.jsx';

export default function DateGift({ content, day }) {
  const { state, actions, toast } = useAppState();
  const accepted = !!state.rsvps[day];
  const rows = [
    { icon: CalendarClock, label: 'When', value: content.when },
    { icon: MapPin, label: 'Where', value: content.where },
    { icon: Shirt, label: 'Wear', value: content.wear },
    { icon: ShoppingBag, label: 'Bring', value: content.bring },
  ].filter((r) => r.value);

  return (
    <div className="invite reveal">
      <div className="invite__card">
        <p className="invite__lead">{content.invitation}</p>
        <h2 className="invite__event">{content.event}</h2>
        <Divider />
        <dl className="invite__details">
          {rows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="invite__row">
              <dt><Icon size={15} strokeWidth={1.5} aria-hidden="true" /> {label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        {content.note && <p className="invite__note">{content.note}</p>}
        <div className="invite__rsvp">
          {accepted ? (
            <p className="invite__accepted" role="status"><Check size={16} aria-hidden="true" /> Accepted — it’s a date</p>
          ) : (
            <Button variant="velvet" onClick={() => { actions.rsvp(day); toast('It’s a date ♡'); }}>
              {content.rsvp || 'I’ll be there'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
