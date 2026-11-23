import { Check } from 'lucide-react';
import Button from '../Button.jsx';

/** A tear-off ticket. `redeemedAt` (ISO) marks it used — it stays visible forever. */
export default function CouponCard({ coupon, redeemedAt, onRedeem, onChoose, chooseMode }) {
  const redeemed = !!redeemedAt;
  return (
    <article className={`coupon ${redeemed ? 'is-redeemed' : ''}`}>
      <div className="coupon__main">
        <p className="coupon__kicker">Love coupon · admit one</p>
        <h3 className="coupon__title">{coupon.title}</h3>
        <p className="coupon__desc">{coupon.description}</p>
        {coupon.terms && <p className="coupon__terms">{coupon.terms}</p>}
      </div>
      <div className="coupon__stub">
        {coupon.expires && <p className="coupon__expires">Expires<br /><span>{coupon.expires}</span></p>}
        {redeemed ? (
          <p className="coupon__stamp" role="status">
            <Check size={14} aria-hidden="true" /> Redeemed
            <span>{new Date(redeemedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
          </p>
        ) : chooseMode ? (
          <Button variant="gold" size="sm" onClick={onChoose}>Choose this</Button>
        ) : (
          onRedeem && <Button variant="gold" size="sm" onClick={onRedeem}>Redeem</Button>
        )}
      </div>
    </article>
  );
}
