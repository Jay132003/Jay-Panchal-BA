import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'motion/react';
import { impactItems } from '../../data/portfolio';
import { Box } from './Bento';

/** The three headline numbers, large, counting up the first time they show. */
export default function Impact({ ready, delay }: { ready: boolean; delay: number }) {
  return (
    <Box index={3} label="Impact" ready={ready} delay={delay} className="bx-impact">
      <div className="bx-metrics">
        {impactItems.map((item, i) => (
          <div key={item.title} className="bx-metric">
            <CountUp value={item.metric} start={ready} delay={delay + 0.2 + i * 0.12} />
            <span className="bx-metric-title">{item.title}</span>
            <span className="bx-metric-desc">{item.description}</span>
          </div>
        ))}
      </div>
    </Box>
  );
}

/** "100+" → counts 0…100 and keeps the "+". Writes straight to the DOM so the
 *  tween doesn't re-render React every frame. */
function CountUp({ value, start, delay }: { value: string; start: boolean; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [done, setDone] = useState(false);
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : '';

  useEffect(() => {
    const el = ref.current;
    if (!el || !match || !start || !inView || done) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDone(true);
      return;
    }
    el.textContent = `0${suffix}`;
    const controls = animate(0, target, {
      duration: 1.4,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${Math.round(v)}${suffix}`;
      },
      onComplete: () => setDone(true),
    });
    return () => controls.stop();
  }, [start, inView]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span ref={ref} className="bx-metric-value">
      {value}
    </span>
  );
}
