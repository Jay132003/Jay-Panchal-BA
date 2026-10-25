import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import {
  SIGNATURE_STROKES,
  SIGNATURE_STROKE_WIDTH,
  SIGNATURE_VIEWBOX,
} from '../../data/signature';

// The credits line, replaced (Oct 25): Jay's own signature writes itself on,
// in his real stroke order, when the sign-off scrolls into view. Click it to
// watch him sign again.

// When each stroke starts on the shared timeline (no pauses between strokes).
const STARTS = SIGNATURE_STROKES.reduce<number[]>((acc, _, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + SIGNATURE_STROKES[i - 1].duration);
  return acc;
}, []);
const WRITE_S = STARTS[STARTS.length - 1] + SIGNATURE_STROKES[SIGNATURE_STROKES.length - 1].duration;

/** Drawn fraction of a stroke `t` seconds after it starts (pen dynamics from `keys`). */
function drawnAt(keys: number[], duration: number, t: number) {
  if (t <= 0) return 0;
  if (t >= duration) return 1;
  const x = (t / duration) * (keys.length - 1);
  const i = Math.floor(x);
  return keys[i] + (keys[i + 1] - keys[i]) * (x - i);
}

export default function SignedOff({ name }: { name: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  // Bumped on every click, so the same clock writes the signature again.
  const [take, setTake] = useState(0);
  const [signed, setSigned] = useState(false);

  // One rAF clock writes the dash offsets straight to the DOM, as the old preloader did.
  useEffect(() => {
    if (reduce || !inView) return;
    const els = paths.current.filter((el): el is SVGPathElement => !!el);
    const lengths = els.map((el) => el.getTotalLength());
    els.forEach((el, i) => {
      el.style.strokeDasharray = `${lengths[i]} ${lengths[i] + 1}`;
    });
    setSigned(false);

    let raf = 0;
    let t0 = -1;
    const tick = (now: number) => {
      if (t0 < 0) t0 = now;
      const t = (now - t0) / 1000;
      els.forEach((el, i) => {
        const s = SIGNATURE_STROKES[i];
        const drawn = drawnAt(s.keys, s.duration, t - STARTS[i]);
        el.style.strokeDashoffset = `${lengths[i] * (1 - drawn)}`;
        // Hidden until pen-down, so the round cap doesn't show as an early dot.
        el.style.visibility = drawn > 0 ? 'visible' : 'hidden';
      });
      if (t < WRITE_S) raf = requestAnimationFrame(tick);
      else setSigned(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, inView, take]);

  return (
    <div className="bx-signed">
      <button
        ref={ref}
        type="button"
        className="bx-signed-pen"
        onClick={() => signed && setTake((n) => n + 1)}
        aria-label={`${name}'s signature — click to sign again`}
        title="Sign again"
      >
        <svg viewBox={SIGNATURE_VIEWBOX} fill="none" aria-hidden="true">
          <g strokeWidth={SIGNATURE_STROKE_WIDTH}>
            {SIGNATURE_STROKES.map((s, i) => (
              <path
                key={i}
                ref={(el) => {
                  paths.current[i] = el;
                }}
                d={s.d}
                style={reduce ? undefined : { visibility: 'hidden' }}
              />
            ))}
          </g>
        </svg>
      </button>
      <p className="bx-signed-note">
        Signed in Ahmedabad · © {new Date().getFullYear()}
      </p>
    </div>
  );
}
