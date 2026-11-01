import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { gallery } from '../../data/life';
import { Lightbox } from './Gallery';

const ease = [0.22, 1, 0.36, 1] as const;
const GAP = 20;

/** Columns for a given wall width: 3 on desktop, 2 on tablets and phones. */
const columnsFor = (width: number) => (width >= 860 ? 3 : 2);

/** The Gallery page (Nov 1, after a masonry reference Jay liked): every photo
 *  big, at its own shape, in balanced columns — each photo goes to the
 *  shortest column, so the wall reads left to right and the columns end
 *  level. Photos fade up as they scroll in; click opens the Lightbox. */
export default function PhotoWall() {
  const ref = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(3);
  const [open, setOpen] = useState<number | null>(null);
  const still = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setCols(columnsFor(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Deal photos into columns by height (aspect ratio), shortest column first.
  const columns = useMemo(() => {
    const out = Array.from({ length: cols }, () => ({ height: 0, items: [] as number[] }));
    gallery.forEach((p, i) => {
      const shortest = out.reduce((a, b) => (b.height < a.height ? b : a));
      shortest.items.push(i);
      shortest.height += p.h / p.w;
    });
    return out.map((c) => c.items);
  }, [cols]);

  return (
    <div ref={ref} className="wall" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: GAP }}>
      {columns.map((items, c) => (
        <div key={c} className="wall-col" style={{ gap: GAP }}>
          {items.map((i) => {
            const p = gallery[i];
            return (
              <motion.button
                key={p.src}
                type="button"
                className="wall-photo"
                style={{ aspectRatio: `${p.w} / ${p.h}` }}
                onClick={() => setOpen(i)}
                aria-label={`Open photo ${i + 1} of ${gallery.length}`}
                initial={still ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -40px 0px' }}
                transition={{ duration: 0.6, ease }}
              >
                <img
                  src={p.src}
                  srcSet={`${p.src} 520w, ${p.full} 1400w`}
                  sizes="(max-width: 860px) 50vw, 360px"
                  alt=""
                  width={p.w}
                  height={p.h}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </motion.button>
            );
          })}
        </div>
      ))}
      <Lightbox index={open} onIndex={setOpen} />
    </div>
  );
}
