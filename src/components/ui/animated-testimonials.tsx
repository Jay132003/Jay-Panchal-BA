import { useCallback, useEffect, useState, type CSSProperties } from 'react';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

// Animated Testimonials, from Aceternity UI (ui.aceternity.com/components/animated-testimonials),
// added by hand: the project has no shadcn setup, and its two dependencies (motion,
// @tabler/icons-react) were already installed. Changes for this site (Oct 25):
// - each card keeps a fixed tilt (the original re-rolled random tilts on every
//   render, which made the stack twitch);
// - autoplay pauses while hovered, and a hairline shows the time to the next card;
// - an optional link on the designation (used for friends' Instagram);
// - a counter, and the site's tokens (styles in life.css) instead of Tailwind greys.

export type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
  /** Makes the designation a link (e.g. an Instagram profile). */
  link?: string;
};

const TILTS = [-7, 5, -3, 8, -5, 4, -8, 6];
const ease = [0.22, 1, 0.36, 1] as const;

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
  interval = 6000,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
  interval?: number;
}) => {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = testimonials.length;

  const handleNext = useCallback(() => setActive((prev) => (prev + 1) % count), [count]);
  const handlePrev = useCallback(() => setActive((prev) => (prev - 1 + count) % count), [count]);

  // `active` is a dependency so a manual step restarts the countdown.
  useEffect(() => {
    if (!autoplay || paused || reduce) return;
    const id = window.setTimeout(handleNext, interval);
    return () => window.clearTimeout(id);
  }, [autoplay, paused, reduce, interval, active, handleNext]);

  const current = testimonials[active];

  return (
    <div
      className="at"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="at-stack">
        <AnimatePresence>
          {testimonials.map((t, i) => {
            const on = i === active;
            const tilt = TILTS[i % TILTS.length];
            return (
              <motion.div
                key={t.src}
                initial={{ opacity: 0, scale: 0.9, z: -100, rotate: tilt }}
                animate={{
                  opacity: on ? 1 : 0.7,
                  scale: on ? 1 : 0.95,
                  z: on ? 0 : -100,
                  rotate: on ? 0 : tilt,
                  zIndex: on ? 40 : count + 2 - i,
                  y: on && !reduce ? [0, -18, 0] : 0,
                }}
                exit={{ opacity: 0, scale: 0.9, z: 100, rotate: tilt }}
                transition={{ duration: reduce ? 0 : 0.55, ease }}
                className="at-card"
              >
                <img src={t.src} alt={on ? t.name : ''} width={500} height={500} draggable={false} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="at-copy">
        <motion.div
          key={active}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: reduce ? 0 : 0.35, ease }}
        >
          <h3 className="at-name">{current.name}</h3>
          <p className="at-meta">
            {current.link ? (
              <a href={current.link} target="_blank" rel="noreferrer" className="gx-link">
                {current.designation}
              </a>
            ) : (
              current.designation
            )}
          </p>
          <p className="at-quote">
            {current.quote.split(' ').map((word, i) => (
              <motion.span
                key={i}
                initial={{ filter: 'blur(10px)', opacity: 0, y: 5 }}
                animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0 : 0.3, ease: 'easeInOut', delay: reduce ? 0 : 0.03 * i }}
              >
                {word}&nbsp;
              </motion.span>
            ))}
          </p>
        </motion.div>

        <div className="at-nav">
          <button type="button" onClick={handlePrev} aria-label="Previous">
            <IconArrowLeft aria-hidden="true" />
          </button>
          <button type="button" onClick={handleNext} aria-label="Next">
            <IconArrowRight aria-hidden="true" />
          </button>
          <span className="at-count gx-tabular" aria-live="polite">
            {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
          {autoplay && !reduce && (
            <span
              key={active}
              className="at-timer"
              data-paused={paused || undefined}
              style={{ '--at-interval': `${interval}ms` } as CSSProperties}
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </div>
  );
};
