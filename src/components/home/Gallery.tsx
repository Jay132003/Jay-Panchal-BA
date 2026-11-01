import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, animate, motion, useReducedMotion, type AnimationPlaybackControls } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { featuredPhotos, gallery, type Photo } from '../../data/life';
import { Box } from './Bento';
import { ViewAll } from './CaseStudy';
import { DevelopingReel } from './Soon';

const ease = [0.22, 1, 0.36, 1] as const;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-01-15" → "15 Jan 2026" for alt text and the lightbox. */
const longDate = (date: string) =>
  date ? `${Number(date.slice(8, 10))} ${MONTHS[Number(date.slice(5, 7)) - 1]} ${date.slice(0, 4)}` : '';
const altOf = (p: Photo) => (p.date ? `Photo from ${longDate(p.date)}` : 'Photo');

/** The photos the box rolls through, as indexes into `gallery`. */
const ROLL = featuredPhotos
  .map((name) => gallery.findIndex((p) => p.src.endsWith(`/${name}-sm.jpg`)))
  .filter((i) => i >= 0);
/** What the browser picks the photo file by. */
const SIZES = '(max-width: 720px) 100vw, 520px';
/** Gap (px) between neighbouring photos on the strip. */
const GAP = 16;
/** How far (ms of travel at release speed) a flick carries the strip. */
const THROW = 480;
/** Most photos one flick can pass. */
const MAX_THROW = 8;

const mod = (k: number, n: number) => ((k % n) + n) % n;

/** Box 9 — Gallery (Nov 1), matched frame by frame to Jay's screen recording
 *  of marijanapav.com's camera roll. The photos sit on one endless strip,
 *  16px apart, and `pos` (a float, in photos) says where it is.
 *  - Soft swipe: the strip follows the finger and settles on the nearest
 *    photo (past a quarter it rolls on one) in ~0.3s.
 *  - Hard swipe: the release speed throws it on — up to 8 photos — and it
 *    slows to a stop on a photo. While it moves fast the photos smear
 *    sideways (horizontal motion blur) and the frame leans away from the
 *    direction of travel, both scaled by the speed.
 *  The dots hand the pill from one to the next as `pos` passes them; dot
 *  click / ← → move it too. View only — nothing opens on click (Jay). */
export default function Gallery({ index = 9 }: { index?: number }) {
  const count = ROLL.length;
  const [pos, setPos] = useState(0);
  const [speed, setSpeed] = useState(0); // px/ms, signed: + = strip moving left
  const posRef = useRef(0);
  const run = useRef<AnimationPlaybackControls | null>(null);
  const still = useReducedMotion();
  const sizeRef = useRef(480);

  const place = (p: number, v = 0) => {
    posRef.current = p;
    setPos(p);
    setSpeed(v);
  };

  /** Glide to photo `target` (may be past the ends — the strip loops). */
  const glide = (target: number) => {
    run.current?.stop();
    const from = posRef.current;
    const dist = Math.abs(target - from);
    if (still || dist < 0.001) {
      place(target);
      return;
    }
    const step = sizeRef.current + GAP;
    let last = performance.now();
    let prev = from;
    run.current = animate(from, target, {
      // One photo ~0.3s; a long throw stretches to ~0.9s and eases out long.
      duration: Math.min(0.3 + 0.1 * (dist - 1), 0.9),
      ease: dist > 1.5 ? [0.12, 0.8, 0.2, 1] : [0.25, 0.9, 0.35, 1],
      onUpdate: (p) => {
        const now = performance.now();
        const v = ((p - prev) * step) / Math.max(now - last, 1);
        prev = p;
        last = now;
        place(p, v);
      },
      onComplete: () => place(target),
    });
  };

  const at = mod(Math.round(pos), Math.max(count, 1));

  const goTo = (k: number) => {
    const cur = Math.round(posRef.current);
    let d = mod(k - cur, count);
    if (d > count / 2) d -= count;
    glide(cur + d);
  };

  if (!count) {
    return (
      <Box index={index} label="Gallery" aside={<ViewAll href="#gallery-page" />} className="bx-gallery">
        <DevelopingReel height={380} />
      </Box>
    );
  }

  // The pill hands over between the two photos `pos` sits between.
  const lo = Math.floor(pos);
  const frac = pos - lo;
  const dots = (
    <span className="cr-dots" role="tablist" aria-label="Photos">
      {ROLL.map((_, k) => {
        const weight = (mod(lo, count) === k ? 1 - frac : 0) + (mod(lo + 1, count) === k ? frac : 0);
        return (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={k === at}
            aria-label={`Photo ${k + 1}`}
            className="cr-dot"
            style={{ width: 10 + 20 * weight, '--w': `${12 + 88 * weight}%` } as React.CSSProperties}
            onClick={() => goTo(k)}
          />
        );
      })}
    </span>
  );

  return (
    <Box
      index={index}
      label="Gallery"
      aside={
        <>
          {dots}
          <ViewAll href="#gallery-page" />
        </>
      }
      className="bx-gallery"
    >
      <CameraRoll
        pos={pos}
        speed={speed}
        at={at}
        sizeRef={sizeRef}
        onGrab={() => {
          run.current?.stop();
          setSpeed(0);
          return posRef.current;
        }}
        onDrag={(p, v) => place(p, v)}
        onRelease={(p, v) => {
          const step = sizeRef.current + GAP;
          // Where the throw would carry it, then the nearest photo to that.
          let target = Math.round(p + Math.max(-MAX_THROW, Math.min(MAX_THROW, (v * THROW) / step)));
          // A soft drag past a quarter still rolls on one.
          const moved = p - Math.round(p);
          if (target === Math.round(p) && Math.abs(moved) > 0.25 && Math.abs(v) < 0.3) target += Math.sign(moved);
          glide(target);
        }}
        onStep={(d) => glide(Math.round(posRef.current) + d)}
      />
    </Box>
  );
}

function CameraRoll({
  pos,
  speed,
  at,
  sizeRef,
  onGrab,
  onDrag,
  onRelease,
  onStep,
}: {
  pos: number;
  speed: number;
  at: number;
  sizeRef: React.MutableRefObject<number>;
  onGrab: () => number;
  onDrag: (p: number, v: number) => void;
  onRelease: (p: number, v: number) => void;
  onStep: (d: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(480);
  const drag = useRef<{ x: number; start: number; lastX: number; t: number; v: number; p: number } | null>(null);
  const blurId = `cr-blur-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      setSize(e.contentRect.width);
      sizeRef.current = e.contentRect.width;
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [sizeRef]);

  const step = size + GAP;

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    const p = onGrab();
    drag.current = { x: e.clientX, start: p, lastX: e.clientX, t: performance.now(), v: 0, p };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const now = performance.now();
    const dt = Math.max(now - d.t, 1);
    // Smoothed px/ms, + when the strip moves left (finger moving left)
    d.v = d.v * 0.4 + ((d.lastX - e.clientX) / dt) * 0.6;
    d.lastX = e.clientX;
    d.t = now;
    d.p = d.start + (d.x - e.clientX) / step;
    onDrag(d.p, d.v);
  };
  const onUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    // A pause before letting go kills the throw, as on a phone.
    const v = performance.now() - d.t > 80 ? 0 : d.v;
    onRelease(d.p, v);
  };
  const onKey = (e: ReactKeyboardEvent) => {
    if (e.key === 'ArrowRight') onStep(1);
    else if (e.key === 'ArrowLeft') onStep(-1);
    else return;
    e.preventDefault();
  };

  // Photos on the strip that can be in view: one either side of `pos`.
  const lo = Math.floor(pos);
  const slots = [lo - 1, lo, lo + 1, lo + 2];
  const fast = Math.abs(speed);
  const blur = Math.min(fast * 4, 16);
  const lean = Math.max(-7, Math.min(7, speed * 2.2));

  return (
    <div
      ref={ref}
      className="cr"
      role="region"
      aria-roledescription="carousel"
      aria-label={`Camera roll, photo ${at + 1} of ${ROLL.length}`}
      tabIndex={0}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onKeyDown={onKey}
    >
      <svg className="cr-filter" aria-hidden="true">
        <filter id={blurId} x="-10%" y="0" width="120%" height="100%">
          <feGaussianBlur stdDeviation={`${blur.toFixed(2)} 0`} />
        </filter>
      </svg>
      <div
        className="cr-strip"
        style={{
          filter: blur > 0.4 ? `url(#${blurId})` : undefined,
          transform: Math.abs(lean) > 0.05 ? `perspective(${size * 2}px) rotateY(${lean}deg)` : undefined,
        }}
      >
        {slots.map((k) => {
          const p = gallery[ROLL[mod(k, ROLL.length)]];
          const x = (k - pos) * step;
          if (x <= -step || x >= size + GAP) return null;
          return (
            <div key={k} className="cr-pane" style={{ transform: `translate3d(${x}px,0,0)`, width: size }}>
              <img
                src={p.src}
                srcSet={`${p.src} 520w, ${p.full} 1400w`}
                sizes={SIZES}
                alt={mod(k, ROLL.length) === at ? altOf(p) : ''}
                draggable={false}
              />
            </div>
          );
        })}
      </div>
      {/* Warm the next few so a long throw never shows an empty frame. */}
      <span className="cr-preload" aria-hidden="true">
        {ROLL.map((g) => (
          <img key={g} src={gallery[g].src} srcSet={`${gallery[g].src} 520w, ${gallery[g].full} 1400w`} sizes={SIZES} alt="" loading="lazy" />
        ))}
      </span>
    </div>
  );
}

/** One photo, large, over the page. ← → step through the roll, Esc closes. */
export function Lightbox({ index, onIndex }: { index: number | null; onIndex: (i: number | null) => void }) {
  const open = index !== null;
  const step = (d: number) => index !== null && onIndex((index + d + gallery.length) % gallery.length);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onIndex(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = overflow;
    };
  }); // re-binds each render so `step` sees the current index

  // Warm the neighbours so stepping feels instant.
  useEffect(() => {
    if (index === null) return;
    [1, -1].forEach((d) => {
      const n = gallery[(index + d + gallery.length) % gallery.length];
      if (n) new Image().src = n.full;
    });
  }, [index]);

  const p = index !== null ? gallery[index] : null;

  return createPortal(
    <AnimatePresence>
      {p && (
        <motion.div
          key="lb"
          className="lb"
          role="dialog"
          aria-modal="true"
          aria-label={altOf(p)}
          onClick={() => onIndex(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.figure
              key={p.full}
              className="lb-figure"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, ease }}
            >
              <img src={p.full} alt={altOf(p)} style={{ aspectRatio: `${p.w} / ${p.h}` }} />
            </motion.figure>
          </AnimatePresence>
          <div className="lb-bar" onClick={(e) => e.stopPropagation()}>
            <span className="lb-meta">
              {p.date ? longDate(p.date) : 'Undated'} · {index! + 1} / {gallery.length}
            </span>
            <span className="lb-actions">
              <button type="button" onClick={() => step(-1)} aria-label="Previous photo">
                <ChevronLeft aria-hidden="true" />
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Next photo">
                <ChevronRight aria-hidden="true" />
              </button>
              <button type="button" onClick={() => onIndex(null)} aria-label="Close">
                <X aria-hidden="true" />
              </button>
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
