import { useState } from 'react';
import CouponCard from './CouponCard.jsx';
import ConfirmationDialog from '../ConfirmationDialog.jsx';
import { useAppState } from '../../hooks/useAppState.jsx';

export default function CouponGift({ content, day }) {
  const { state, actions, toast } = useAppState();
  const [pending, setPending] = useState(null); // { kind: 'redeem' | 'choose', coupon }
  const coupons = content.coupons || [];
  const chosenId = state.chosenCoupons[day];
  const chosen = coupons.find((c) => c.id === chosenId);
  // Guard against an invalid stored choice (e.g. a coupon id was renamed) — fall back to choosing again.
  const choosing = content.choose && !chosen;
  const visible = content.choose ? (chosen ? [chosen] : coupons) : coupons;

  const confirm = () => {
    if (!pending) return;
    if (pending.kind === 'choose') {
      actions.choose(day, pending.coupon.id);
      toast('Good choice. I’m already looking forward to it.');
    } else {
      actions.redeem(pending.coupon.id);
      toast('Redeemed. Show this to me ♡');
    }
    setPending(null);
  };

  return (
    <div className="coupon-gift">
      {content.intro && <p className="gift-intro reveal">{choosing ? content.intro : chosen ? 'You chose. Here’s your coupon — redeem it whenever you’re ready.' : content.intro}</p>}
      <div className="coupon-gift__list">
        {visible.map((c, i) => (
          <div key={c.id} className="reveal" style={{ animationDelay: `${150 + i * 120}ms` }}>
            <CouponCard
              coupon={c}
              chooseMode={choosing}
              redeemedAt={state.redeemedCoupons[c.id]}
              onChoose={() => setPending({ kind: 'choose', coupon: c })}
              onRedeem={() => setPending({ kind: 'redeem', coupon: c })}
            />
          </div>
        ))}
      </div>
      <ConfirmationDialog
        open={!!pending}
        title={pending?.kind === 'choose' ? `Choose “${pending?.coupon.title}”?` : `Redeem “${pending?.coupon.title}”?`}
        message={pending?.kind === 'choose' ? 'Once chosen, it’s yours — the others fly away.' : 'It will be marked as used. You can still look at it any time.'}
        confirmLabel={pending?.kind === 'choose' ? 'Yes, this one' : 'Redeem now'}
        onConfirm={confirm}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}
