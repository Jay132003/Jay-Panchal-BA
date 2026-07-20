import { useEffect, useLayoutEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

// Greetings roll past one at a time — the world says hello. Each is unique
// (no repeats). Native scripts fall back to the OS font for each language.
export const GREETINGS = [
  'Hello',          // English
  'કેમ છો?',        // Gujarati
  'नमस्ते',          // Hindi
  'ਸਤ ਸ੍ਰੀ ਅਕਾਲ',    // Punjabi
  'こんにちは',        // Japanese
  'Bonjour',        // French
  'Hola',           // Spanish
];

// Snappy cadence: the first greeting settles, the rest roll past quickly.
const FIRST_MS = 440;
const STEP_MS = 250;
// Let the final greeting rest a beat before the curtain lifts, so the ending
// doesn't feel abrupt.
const HOLD_MS = 380;

// How long the words cycle before the curtain lifts. App uses this to time the
// loader → content hand-off so the two stay in sync.
export const PRELOADER_CYCLE_MS =
  FIRST_MS + (GREETINGS.length - 1) * STEP_MS + HOLD_MS;

const CURTAIN_EASE = [0.76, 0, 0.24, 1] as const;
const WORD_EASE = [0.22, 1, 0.36, 1] as const;

export default function Preloader() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [dim, setDim] = useState({ width: 0, height: 0 });

  // Read the real viewport before the first paint, and keep the curve accurate
  // if the viewport changes. (useLayoutEffect avoids a 0-sized flash in
  // embedded contexts where the initial render sees no dimensions.)
  useLayoutEffect(() => {
    const measure = () =>
      setDim({ width: window.innerWidth, height: window.innerHeight });
    measure();
    window.addEventListener('resize', measure);
    // A tab opened in the background reports a 0-sized viewport; re-measure
    // once it becomes visible so the curve still renders.
    document.addEventListener('visibilitychange', measure);
    return () => {
      window.removeEventListener('resize', measure);
      document.removeEventListener('visibilitychange', measure);
    };
  }, []);

  // Step through the greetings; stop on the last one and hold it.
  useEffect(() => {
    if (index === GREETINGS.length - 1) return;
    const id = window.setTimeout(
      () => setIndex((i) => i + 1),
      index === 0 ? FIRST_MS : STEP_MS,
    );
    return () => window.clearTimeout(id);
  }, [index]);

  // A bottom edge that bulges down while the curtain is up, then flattens as
  // the curtain slides away — the signature "peel" reveal. Filled with the
  // current theme background so the curtain matches the site.
  const bulge = `M0 0 L${dim.width} 0 L${dim.width} ${dim.height} Q${dim.width / 2} ${dim.height + 260} 0 ${dim.height} L0 0`;
  const flat = `M0 0 L${dim.width} 0 L${dim.width} ${dim.height} Q${dim.width / 2} ${dim.height} 0 ${dim.height} L0 0`;

  return (
    <motion.div
      className="preloader"
      exit={{
        y: '-100%',
        transition: { duration: reduce ? 0.4 : 0.85, ease: CURTAIN_EASE },
      }}
      aria-hidden="true"
    >
      <p className="preloader-word">
        <span className="preloader-word-slot">
          {/* initial={false} — the first word is already on screen from the
              static splash, so it appears without re-animating; the rest roll. */}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={index}
              className="preloader-word-text"
              initial={{ opacity: 0, scale: reduce ? 1 : 0.92, filter: reduce ? 'none' : 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: reduce ? 1 : 1.04, filter: reduce ? 'none' : 'blur(4px)' }}
              transition={{ duration: reduce ? 0.15 : 0.4, ease: WORD_EASE }}
            >
              {GREETINGS[index]}
            </motion.span>
          </AnimatePresence>
        </span>
      </p>

      {dim.width > 0 && (
        <svg className="preloader-curve" preserveAspectRatio="none">
          <motion.path
            animate={{ d: bulge }}
            exit={{
              d: flat,
              transition: { duration: reduce ? 0 : 0.8, ease: CURTAIN_EASE },
            }}
          />
        </svg>
      )}
    </motion.div>
  );
}
