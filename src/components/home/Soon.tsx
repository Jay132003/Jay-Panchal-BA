import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';

// "Coming soon" stand-ins for the case study, gallery and friends boxes and
// their pages (Oct 25). Each one hints at what's coming instead of sitting
// empty: the case study keeps rearranging its research, the gallery's frames are
// still developing, and the friends' cards keep shuffling with blanks where the
// faces, names and stories will go.

const ease = [0.22, 1, 0.36, 1] as const;

/** A small "● Coming soon" tag; the dot breathes. */
export function SoonBadge({ children = 'Coming soon', tone }: { children?: ReactNode; tone?: 'red' }) {
  return (
    <span className="soon-badge" data-tone={tone}>
      <span className="soon-dot" aria-hidden="true" />
      {children}
    </span>
  );
}

/** Runs only while the element is on screen and motion is allowed. */
function useTicker(ref: RefObject<Element | null>, ms: number) {
  const reduce = useReducedMotion();
  const inView = useInView(ref, { margin: '-80px' });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setInterval(() => setTick((t) => t + 1), ms);
    return () => window.clearInterval(id);
  }, [reduce, inView, ms]);
  return tick;
}

/* ── Case study: the research, still being sorted out ─────────── */

const PIECES = ['Notes', 'Interviews', 'Sketches', 'Data', 'First draft'];
/** Three arrangements the pieces drift between (fractions of the board). */
const LAYOUTS = [
  [{ x: 0.22, y: 0.3, r: -6 }, { x: 0.58, y: 0.24, r: 5 }, { x: 0.82, y: 0.62, r: -4 }, { x: 0.36, y: 0.72, r: 7 }, { x: 0.64, y: 0.78, r: -3 }],
  [{ x: 0.7, y: 0.32, r: 4 }, { x: 0.3, y: 0.66, r: -7 }, { x: 0.18, y: 0.26, r: 6 }, { x: 0.84, y: 0.72, r: -5 }, { x: 0.5, y: 0.5, r: 3 }],
  [{ x: 0.46, y: 0.26, r: -3 }, { x: 0.8, y: 0.4, r: 6 }, { x: 0.26, y: 0.52, r: -5 }, { x: 0.6, y: 0.74, r: 4 }, { x: 0.2, y: 0.78, r: -6 }],
];
const WIGGLE = [
  [120, -80, -110, 90],
  [-140, 100, 80, -120],
  [100, 110, -130, -50],
  [-80, -100, 150, 80],
];

type Pt = { x: number; y: number };

function wire(points: Pt[]) {
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const [w1, w2, w3, w4] = WIGGLE[i - 1];
    d += ` C${a.x + (b.x - a.x) / 3 + w1},${a.y + (b.y - a.y) / 3 + w2} ${a.x + ((b.x - a.x) * 2) / 3 + w3},${a.y + ((b.y - a.y) * 2) / 3 + w4} ${b.x},${b.y}`;
  }
  return d;
}

export function UntanglingBoard({ height = 250 }: { height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [w, setW] = useState(0);
  const tick = useTicker(ref, 3400);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const layout = LAYOUTS[tick % LAYOUTS.length];
  // Kept clear of the edges so no piece hangs off a narrow board.
  const at = layout.map((p) => ({ x: Math.min(Math.max(p.x * w, 64), w - 64), y: p.y * height }));
  const move = reduce ? { duration: 0 } : { type: 'spring' as const, stiffness: 40, damping: 14, mass: 1.1 };

  return (
    <div ref={ref} className="cs-stage soon-board" style={{ height }}>
      <span className="cs-state">
        <SoonBadge>In the works · coming soon</SoonBadge>
      </span>
      {w > 0 && (
        <>
          <svg className="cs-wires" width={w} height={height} aria-hidden="true">
            <motion.path
              className="cs-wire"
              initial={false}
              animate={{ d: wire(at) }}
              transition={reduce ? { duration: 0 } : { duration: 1.6, ease }}
            />
          </svg>
          {PIECES.map((label, i) => (
            <motion.div
              key={label}
              className="cs-chip"
              initial={false}
              animate={{ x: at[i].x, y: at[i].y, rotate: layout[i].r }}
              transition={{ ...move, delay: reduce ? 0 : i * 0.06 }}
              style={{ '--i': i } as CSSProperties}
              aria-hidden="true"
            >
              <span className="cs-chip-in">
                <span className="cs-chip-before">{label}</span>
              </span>
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
}

/* ── Gallery: frames still developing ─────────────────────────── */

/** Frame shapes per column (true = landscape), and how far each column travels. */
const REEL: { wide: boolean[]; range: [number, number] }[] = [
  { wide: [false, true, false, false, true, false, true, false], range: [-40, -420] },
  { wide: [true, false, false, true, false, false, true, false], range: [-520, -120] },
  { wide: [false, false, true, false, true, false, false, true], range: [-20, -560] },
];

export function DevelopingReel({ height = 600 }: { height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const glide = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.5 });

  return (
    <div ref={ref} className="gl-stage soon-reel" style={{ height }}>
      {REEL.map((col, c) => (
        <FrameColumn key={c} wide={col.wide} range={col.range} progress={glide} still={!!reduce} offset={c} />
      ))}
      <div className="soon-veil">
        <SoonBadge tone="red">Developing · coming soon</SoonBadge>
        <p>Photos I've taken are still in the darkroom.</p>
      </div>
    </div>
  );
}

function FrameColumn({
  wide,
  range,
  progress,
  still,
  offset,
}: {
  wide: boolean[];
  range: [number, number];
  progress: MotionValue<number>;
  still: boolean;
  offset: number;
}) {
  const y = useTransform(progress, [0, 1], range);
  return (
    <motion.div className="gl-col" style={{ y: still ? (range[0] + range[1]) / 2 : y }} aria-hidden="true">
      {wide.map((w, i) => (
        <span
          key={i}
          className="soon-frame"
          data-wide={w || undefined}
          style={{ '--d': `${((i * 3 + offset * 5) % 11) * -0.7}s`, '--k': (i + offset) % 4 } as CSSProperties}
        >
          <span className="soon-frame-no">{String(offset * wide.length + i + 1).padStart(2, '0')}</span>
        </span>
      ))}
    </motion.div>
  );
}

/* ── Friends: a deck of cards still waiting for faces ──────────── */

const DECK = 4;
const TILTS = [0, -6, 5, -3];

export function CardDeck({ height = 300 }: { height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const tick = useTicker(ref, 2800);

  return (
    <div ref={ref} className="soon-deck" style={{ height }}>
      {Array.from({ length: DECK }, (_, card) => {
        // Position in the pile: 0 is on top; every tick the top card goes to the back.
        const pos = (card - (tick % DECK) + DECK) % DECK;
        const wasTop = !reduce && tick > 0 && pos === DECK - 1;
        return (
          <motion.div
            key={card}
            className="soon-card"
            initial={false}
            animate={{
              x: wasTop ? [0, 150, 0] : 0,
              y: pos * 7,
              rotate: wasTop ? [0, 14, TILTS[pos]] : TILTS[pos],
              scale: 1 - pos * 0.04,
              zIndex: wasTop ? [DECK + 1, DECK + 1, 0] : DECK - pos,
            }}
            transition={{ duration: reduce ? 0 : wasTop ? 1 : 0.6, ease, times: wasTop ? [0, 0.45, 1] : undefined }}
            aria-hidden="true"
          >
            <span className="soon-card-photo">?</span>
            <span className="soon-card-lines">
              <span className="soon-line soon-line--name" />
              <span className="soon-line" />
              <span className="soon-line soon-line--short" />
              <span className="soon-card-handle">@coming.soon</span>
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
