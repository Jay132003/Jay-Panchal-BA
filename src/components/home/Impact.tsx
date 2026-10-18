import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { impactItems } from '../../data/portfolio';
import { Box } from './Bento';

/** The three headline numbers, large, rolling into place like an odometer
 *  the first time they show. */
export default function Impact({ ready, delay }: { ready: boolean; delay: number }) {
  return (
    <Box index={3} label="Impact" ready={ready} delay={delay} className="bx-impact">
      <div className="bx-metrics">
        {impactItems.map((item, i) => (
          <div key={item.title} className="bx-metric">
            <Odometer value={item.metric} start={ready} delay={delay + 0.2 + i * 0.12} />
            <span className="bx-metric-title">{item.title}</span>
            <span className="bx-metric-desc">{item.description}</span>
          </div>
        ))}
      </div>
    </Box>
  );
}

/** "100+" → a strip of digits per column that rolls to its number, the last
 *  column spinning most (Oct 18, replaces the count-up). Pure CSS transitions,
 *  so nothing re-renders per frame. */
export function Odometer({ value, start, delay }: { value: string; start: boolean; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const still = useReducedMotion();
  const readyAt = useRef<number | null>(null);
  const [rollDelay, setRollDelay] = useState<number | null>(null);
  const match = value.match(/^(\d+)(.*)$/);

  useEffect(() => {
    if (start && readyAt.current == null) readyAt.current = performance.now();
  }, [start]);

  useEffect(() => {
    if (!start || !inView || rollDelay != null) return;
    // On the first screen it waits for the page's cascade; scrolled to later
    // (or reached via a section link), it rolls straight away instead of
    // sitting on "0" for a second.
    const late = performance.now() - (readyAt.current ?? 0) > 1500;
    // Two frames, so the strip is painted at 0 before it starts moving.
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(() => setRollDelay(late ? 0.05 : delay));
    });
    return () => cancelAnimationFrame(id);
  }, [start, inView]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!match || still) {
    return <span className="bx-metric-value">{value}</span>;
  }

  const digits = match[1].split('');
  return (
    <span ref={ref} className="bx-metric-value bx-odo" role="img" aria-label={value}>
      {digits.map((d, i) => {
        const turns = digits.length - i; // like a real counter, the last digit spins most
        const steps = turns * 10 + Number(d);
        return (
          <span key={i} className="bx-odo-col" aria-hidden="true">
            <span
              className="bx-odo-strip"
              style={{
                transform: rollDelay == null ? undefined : `translateY(${-steps}em)`,
                transitionDelay: `${(rollDelay ?? 0) + i * 0.08}s`,
              }}
            >
              {Array.from({ length: steps + 1 }, (_, k) => (
                <span key={k}>{k % 10}</span>
              ))}
            </span>
          </span>
        );
      })}
      <span className="bx-odo-suffix" aria-hidden="true">{match[2]}</span>
    </span>
  );
}
