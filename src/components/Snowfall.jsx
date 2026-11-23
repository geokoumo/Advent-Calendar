import { useEffect, useRef } from 'react';
import { useAppState } from '../hooks/useAppState.jsx';

/** Very light canvas snowfall. Off when motion is reduced or snow is disabled. */
export default function Snowfall({ density = 1 }) {
  const ref = useRef(null);
  const { reducedMotion, state } = useAppState();
  const enabled = !reducedMotion && state.preferences.snow;

  useEffect(() => {
    if (!enabled) return;
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let w, h, raf, flakes;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(70, (w * h) / 14000) * density);
      flakes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.8,
        s: 0.15 + Math.random() * 0.45,
        d: Math.random() * Math.PI * 2,
        o: 0.25 + Math.random() * 0.5,
      }));
    };
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.y += f.s;
        f.d += 0.008;
        f.x += Math.sin(f.d) * 0.25;
        if (f.y > h + 4) {
          f.y = -4;
          f.x = Math.random() * w;
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(248,241,232,${f.o})`;
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (document.visibilityState === 'visible') raf = requestAnimationFrame(tick);
    };
    resize();
    raf = requestAnimationFrame(tick);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [enabled, density]);

  if (!enabled) return null;
  return <canvas ref={ref} className="snowfall" aria-hidden="true" />;
}
