import { useEffect, useRef, useState } from 'react';

/**
 * A gold-foil scratch layer over its children.
 * Reveals once ~45% has been scratched, or instantly via the accessible button.
 */
export default function ScratchCard({ children, onReveal, revealed: initiallyRevealed = false, label = 'Scratch to reveal' }) {
  const canvasRef = useRef(null);
  const [revealed, setRevealed] = useState(initiallyRevealed);
  const drawing = useRef(false);
  const last = useRef(null);

  const finish = () => {
    if (revealed) return;
    setRevealed(true);
    onReveal?.();
  };

  useEffect(() => {
    if (revealed) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    const g = ctx.createLinearGradient(0, 0, width, height);
    g.addColorStop(0, '#b8945c');
    g.addColorStop(0.45, '#ead8b4');
    g.addColorStop(0.55, '#d9bd8c');
    g.addColorStop(1, '#a8844f');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
    // fine foil texture
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.12})`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1);
    }
    ctx.fillStyle = 'rgba(56,27,41,.7)';
    ctx.font = '500 13px Jost, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '3px';
    ctx.fillText(label.toUpperCase(), width / 2, height / 2 + 4);
  }, [revealed, label]);

  const point = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const scratch = (e) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const p = point(e);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 34;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(last.current?.x ?? p.x, last.current?.y ?? p.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };

  const checkProgress = () => {
    const c = canvasRef.current;
    if (!c) return;
    const data = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 64) {
      total++;
      if (data[i] === 0) clear++;
    }
    if (clear / total > 0.45) finish();
  };

  return (
    <div className={`scratch ${revealed ? 'is-revealed' : ''}`}>
      <div className="scratch__content" aria-hidden={!revealed}>{children}</div>
      {!revealed && (
        <>
          <canvas
            ref={canvasRef}
            className="scratch__foil"
            aria-hidden="true"
            onPointerDown={(e) => {
              drawing.current = true;
              last.current = null;
              e.currentTarget.setPointerCapture(e.pointerId);
              scratch(e);
            }}
            onPointerMove={scratch}
            onPointerUp={() => {
              drawing.current = false;
              checkProgress();
            }}
            onPointerCancel={() => (drawing.current = false)}
          />
          <button className="scratch__skip" onClick={finish}>Reveal without scratching</button>
        </>
      )}
    </div>
  );
}
