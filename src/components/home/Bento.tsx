import { useEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

const ease = [0.22, 1, 0.36, 1] as const;

type BentoProps = {
  children: ReactNode;
  /** Lines only start drawing once the preloader has lifted. */
  ready: boolean;
  /** Seconds before the grid lines start drawing (lets the preloader clear). */
  delay?: number;
};

/** The landing grid. Boxes sit on a "lines" layer and the 1px gaps between
 *  them let it show through, so every box shares a single hairline. The layer
 *  draws itself in top-down on load, and a soft spotlight follows the cursor
 *  and brightens the lines near it. */
export function Bento({ children, ready, delay = 0 }: BentoProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || still.matches) return;

    let raf = 0;
    let x = 0;
    let y = 0;
    const paint = () => {
      raf = 0;
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    el.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      el.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="bx"
      data-ready={ready || undefined}
      style={{ '--bx-delay': `${delay}s` } as CSSProperties}
    >
      <div className="bx-lines" aria-hidden="true">
        <div className="bx-glow" />
      </div>
      <span className="bx-crop bx-crop--l bx-crop--bottom" aria-hidden="true" />
      <span className="bx-crop bx-crop--r bx-crop--bottom" aria-hidden="true" />
      {children}
    </div>
  );
}

type RowProps = HTMLAttributes<HTMLDivElement> & {
  /** grid-template-columns for this row, e.g. "2fr 3fr". */
  cols?: string;
};

/** One band of boxes. Draws the crop marks and "+" corners on its top edge. */
export function Row({ cols = '1fr', className, children, ...rest }: RowProps) {
  return (
    <div {...rest} className={cn('bx-row', className)} style={{ '--bx-cols': cols } as CSSProperties}>
      <span className="bx-crop bx-crop--l" aria-hidden="true" />
      <span className="bx-crop bx-crop--r" aria-hidden="true" />
      {children}
    </div>
  );
}

type BoxProps = {
  id?: string;
  /** Box number shown in the corner label, e.g. 1 → "01". */
  index?: number;
  label?: string;
  /** Small link or note on the right of the label row. */
  aside?: ReactNode;
  className?: string;
  /** Content fades up on load (first screen) instead of on scroll. */
  ready?: boolean;
  delay?: number;
  children: ReactNode;
};

/** A cell of the grid. Content sits straight on it — no card inside. */
export function Box({ id, index, label, aside, className, ready, delay = 0, children }: BoxProps) {
  const hidden = { opacity: 0, y: 12, filter: 'blur(4px)' };
  const shown = { opacity: 1, y: 0, filter: 'blur(0px)' };
  const reveal =
    ready === undefined
      ? { whileInView: shown, viewport: { once: true, margin: '-60px' } }
      : { animate: ready ? shown : hidden };

  return (
    <section id={id} className={cn('bx-box', className)} aria-label={label}>
      <motion.div
        className="bx-box-in"
        initial={hidden}
        {...reveal}
        transition={{ duration: 0.6, delay, ease }}
      >
        {label && <BoxLabel index={index} label={label} aside={aside} />}
        {children}
      </motion.div>
    </section>
  );
}

/** "01 — EXPERIENCE" in the box's top-left corner, with an optional aside. */
export function BoxLabel({ index, label, aside }: { index?: number; label: string; aside?: ReactNode }) {
  return (
    <header className="bx-label">
      <span>
        {index != null && <span className="bx-label-index">{String(index).padStart(2, '0')}</span>}
        {index != null && <span className="bx-label-dash" aria-hidden="true">—</span>}
        {label}
      </span>
      {aside && <span className="bx-label-aside">{aside}</span>}
    </header>
  );
}

/** Fades a block up the first time it scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

