import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { caseStudies, type CaseStudy } from '../../data/life';
import { Box } from './Bento';
import { SoonBadge } from './Soon';

const ease = [0.22, 1, 0.36, 1] as const;

/** Where the "before" scraps lie on the board: x %, y %, tilt in degrees. */
const SCRAPS: [number, number, number][] = [
  [7, 18, -6],
  [50, 12, 4],
  [24, 46, -3],
  [58, 44, 6],
  [10, 76, 3],
  [50, 78, -5],
];
/** The tangle drawn between scraps — deliberately out of order. */
const TANGLE = [0, 3, 1, 4, 2, 5, 0];

/** Box 8 — Case studies (Nov 1). A full-width row: the index of studies on
 *  the left, and on the right a before/after board for the one picked. Drag
 *  the handle (or use ← →) to wipe from how the work was really done to the
 *  flow it became — what Jay's About line promises, shown. Fixed height, so
 *  picking another study never moves the grid. */
export default function CaseStudies({ index = 8 }: { index?: number }) {
  const [pick, setPick] = useState(0);
  const study = caseStudies[pick];

  return (
    <Box index={index} label="Case studies" aside={<ViewAll href="#case-studies" />} className="bx-cases">
      <div className="cs2">
        <div className="cs2-index">
          <ol>
            {caseStudies.map((c, i) => (
              <li key={c.id}>
                <button type="button" data-on={i === pick || undefined} onClick={() => setPick(i)}>
                  <span className="cs2-no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="cs2-text">
                    <span className="cs2-title">{c.title}</span>
                    <span className="cs2-area">{c.area}</span>
                  </span>
                  <span className="cs2-value gx-tabular">{c.result.value}</span>
                </button>
              </li>
            ))}
          </ol>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={study.id}
              className="cs2-foot"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease }}
            >
              <p className="cs2-foot-result">
                <strong className="gx-tabular">{study.result.value}</strong>
                {study.result.label}
              </p>
              {study.status === 'live' ? (
                <a href="#case-studies" className="bx-aside-link">
                  Read the case <ArrowRight aria-hidden="true" />
                </a>
              ) : (
                <SoonBadge>Write-up coming soon</SoonBadge>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <BeforeAfter study={study} />
      </div>
    </Box>
  );
}

/** The board: "before" scraps underneath, the "after" flow wiped over them. */
function BeforeAfter({ study }: { study: CaseStudy }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const touched = useRef(false);
  const dragging = useRef(false);
  const inView = useInView(ref, { once: true, margin: '-25% 0px' });
  const still = useReducedMotion();

  // The first time it shows, the handle sweeps once so people see it moves.
  useEffect(() => {
    if (!inView || still) return;
    const run = animate(50, [50, 80, 22, 50], {
      duration: 2.8,
      delay: 0.4,
      ease: 'easeInOut',
      onUpdate: (v) => {
        if (!touched.current) setPos(v);
      },
    });
    return () => run.stop();
  }, [inView, still]);

  useEffect(() => setPos(50), [study.id]);

  const at = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPos(Math.min(Math.max(((e.clientX - r.left) / r.width) * 100, 0), 100));
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    touched.current = true;
    setPos((p) => Math.min(Math.max(p + (e.key === 'ArrowRight' ? 5 : -5), 0), 100));
  };

  const scraps = study.before.slice(0, SCRAPS.length);

  return (
    <div
      ref={ref}
      className="ba"
      onPointerDown={(e) => {
        touched.current = true;
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        at(e);
      }}
      onPointerMove={(e) => {
        if (dragging.current) at(e);
      }}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={study.id}
          className="ba-layers"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Before: scraps of the real process, tangled */}
          <div className="ba-before" role="img" aria-label={`Before: ${study.before.join(', ')}`}>
            <svg className="ba-tangle" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {TANGLE.slice(0, -1).map((from, i) => {
                const to = TANGLE[i + 1];
                if (from >= scraps.length || to >= scraps.length) return null;
                const [x1, y1] = SCRAPS[from];
                const [x2, y2] = SCRAPS[to];
                const cx = (x1 + x2) / 2 + (i % 2 ? 18 : -14);
                const cy = (y1 + y2) / 2 + (i % 2 ? -16 : 12);
                return <path key={i} d={`M${x1 + 12} ${y1 + 5} Q${cx} ${cy} ${x2 + 12} ${y2 + 5}`} />;
              })}
            </svg>
            {scraps.map((text, i) => {
              const [x, y, r] = SCRAPS[i];
              return (
                <span key={text} className="ba-scrap" style={{ left: `${x}%`, top: `${y}%`, rotate: `${r}deg` }}>
                  {text}
                </span>
              );
            })}
            <span className="ba-tag">Before</span>
          </div>

          {/* After: the same work as one calm flow */}
          <div
            className="ba-after"
            role="img"
            style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
            aria-label={`After: ${study.after.join(' → ')}`}
          >
            <ol className="ba-flow">
              {study.after.map((step, i) => (
                <li key={step} style={{ '--i': i } as CSSProperties}>
                  <span className="ba-node">
                    {i === study.after.length - 1 && (
                      <svg viewBox="0 0 12 12" aria-hidden="true">
                        <path d="M2.2 6.4 4.9 9.1 9.8 3.2" />
                      </svg>
                    )}
                    {step}
                  </span>
                </li>
              ))}
            </ol>
            <span className="ba-tag ba-tag--after">After</span>
          </div>
        </motion.div>
      </AnimatePresence>

      <div
        className="ba-handle"
        style={{ left: `${pos}%` }}
        role="slider"
        tabIndex={0}
        aria-label="Before and after"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={onKey}
      >
        <span className="ba-knob" aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <path d="M6 4 2 8l4 4M10 4l4 4-4 4" />
          </svg>
        </span>
      </div>
    </div>
  );
}

/** "View all →" in a box's label row. */
export function ViewAll({ href }: { href: string }) {
  return (
    <a href={href} className="bx-aside-link">
      View all <ArrowRight aria-hidden="true" />
    </a>
  );
}
