import { useLayoutEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  SIGNATURE_STROKES,
  SIGNATURE_STROKE_WIDTH,
  SIGNATURE_VIEWBOX,
} from '../data/signature';

// Apple-style "hello" welcome: Jay's own signature writes itself on in one
// unbroken stroke — every pen stroke back-to-back on a single timeline, in the
// real writing order — rests a beat, then dissolves into the page.

// A short breath on the blank screen before the pen touches down.
const LEAD_IN_S = 0.3;
// Let the finished signature rest before it dissolves.
const HOLD_S = 0.7;

// When each stroke starts on the shared timeline (no pauses between strokes).
const STARTS = SIGNATURE_STROKES.reduce<number[]>((acc, _, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + SIGNATURE_STROKES[i - 1].duration);
  return acc;
}, []);
const WRITE_S = STARTS[STARTS.length - 1] + SIGNATURE_STROKES[SIGNATURE_STROKES.length - 1].duration;

// How long the loader stays up before it exits. App uses this to time the
// loader → content hand-off so the two stay in sync.
export const PRELOADER_CYCLE_MS = Math.round((LEAD_IN_S + WRITE_S + HOLD_S) * 1000);

const EXIT_EASE = [0.4, 0, 0.2, 1] as const;

/** Drawn fraction of a stroke `t` seconds after it starts (pen dynamics from `keys`). */
function drawnAt(keys: number[], duration: number, t: number) {
  if (t <= 0) return 0;
  if (t >= duration) return 1;
  const x = (t / duration) * (keys.length - 1);
  const i = Math.floor(x);
  return keys[i] + (keys[i + 1] - keys[i]) * (x - i);
}

export default function Preloader() {
  const reduce = useReducedMotion();
  const paths = useRef<(SVGPathElement | null)[]>([]);

  // One requestAnimationFrame clock drives every stroke by writing the dash
  // offset straight to the DOM — no per-stroke animations to start/stop, so
  // the pen never stutters or blinks between strokes.
  useLayoutEffect(() => {
    if (reduce) return;
    const els = paths.current.filter((el): el is SVGPathElement => !!el);
    const lengths = els.map((el) => el.getTotalLength());
    els.forEach((el, i) => {
      el.style.strokeDasharray = `${lengths[i]} ${lengths[i] + 1}`;
      el.style.strokeDashoffset = `${lengths[i]}`;
    });

    let raf = 0;
    let t0 = -1;
    const tick = (now: number) => {
      if (t0 < 0) t0 = now;
      const t = (now - t0) / 1000 - LEAD_IN_S;
      els.forEach((el, i) => {
        const s = SIGNATURE_STROKES[i];
        const drawn = drawnAt(s.keys, s.duration, t - STARTS[i]);
        el.style.strokeDashoffset = `${lengths[i] * (1 - drawn)}`;
        // Hidden until pen-down, so the round cap doesn't show as an early dot.
        el.style.visibility = drawn > 0 ? 'visible' : 'hidden';
      });
      if (t < WRITE_S) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  return (
    <motion.div
      className="preloader"
      exit={{
        opacity: 0,
        transition: { duration: 0.6, delay: reduce ? 0 : 0.25, ease: EXIT_EASE },
      }}
      aria-hidden="true"
    >
      <motion.svg
        className="preloader-signature"
        viewBox={SIGNATURE_VIEWBOX}
        fill="none"
        initial={reduce ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        exit={{
          opacity: 0,
          scale: reduce ? 1 : 1.05,
          filter: reduce ? 'none' : 'blur(10px)',
          transition: { duration: 0.55, ease: EXIT_EASE },
        }}
      >
        <g className="preloader-ink" strokeWidth={SIGNATURE_STROKE_WIDTH}>
          {SIGNATURE_STROKES.map((s, i) => (
            <path
              key={i}
              ref={(el) => {
                paths.current[i] = el;
              }}
              d={s.d}
              // Start hidden (before the clock's first frame) unless motion is
              // reduced, in which case the whole signature simply fades in.
              style={reduce ? undefined : { visibility: 'hidden' }}
            />
          ))}
        </g>
      </motion.svg>
    </motion.div>
  );
}
