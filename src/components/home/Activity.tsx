import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Box } from './Bento';

const WEEKS = 53;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Small deterministic hash → 0…1, so a given date always gets the same square. */
function rand(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  h ^= h >>> 13;
  h = Math.imul(h, 0x5bd1e995);
  return ((h ^ (h >>> 15)) >>> 0) / 4294967296;
}

const key = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

/** A natural-looking activity level (0–4) for a day: busy weekdays, quiet
 *  weekends, slow busy/quiet seasons and the odd week off. Decorative only —
 *  Jay asked for a generated pattern rather than real GitHub data (Oct 17),
 *  so the box shows no counts, source or captions. */
function level(d: Date): number {
  const day = d.getDay();
  const weekend = day === 0 || day === 6;
  const t = d.getTime() / 86_400_000;
  const season = 0.5 + 0.5 * Math.sin(t / 23) * Math.cos(t / 61); // 0…1, drifts over weeks
  const week = Math.floor(t / 7);
  if (rand(`off-${week}`) < 0.06) return rand(key(d)) < 0.85 ? 0 : 1; // a week away
  const active = rand(key(d)) < (weekend ? 0.32 : 0.82);
  if (!active) return 0;
  const intensity = rand(`i-${key(d)}`) * 0.6 + season * 0.55;
  return intensity < 0.35 ? 1 : intensity < 0.6 ? 2 : intensity < 0.85 ? 3 : 4;
}

type Cell = { date: Date; level: number } | null;

function buildGrid(today: Date) {
  // Columns are weeks (Sunday first), the last one holds today.
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const start = new Date(end);
  start.setDate(end.getDate() - end.getDay() - (WEEKS - 1) * 7);

  const cells: Cell[] = [];
  const labels: { col: number; text: string }[] = [];
  for (let w = 0; w < WEEKS; w++) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      cells.push(date > end ? null : { date, level: level(date) });
      // Label a column where a new month begins (like GitHub's graph).
      if (date.getDate() === 1 && date <= end) labels.push({ col: w, text: MONTHS[date.getMonth()] });
    }
  }
  // Don't crowd the first label against the edge.
  if (labels[0]?.col === 0 && labels[1]?.col !== undefined && labels[1].col < 3) labels.shift();
  return { cells, labels };
}

/** "Thursday · 14 May 2026" — what the hover box says. Day and date only:
 *  the squares are a generated pattern, so they carry no counts. */
const tipText = (d: Date) =>
  `${d.toLocaleDateString('en-GB', { weekday: 'long' })} · ${d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })}`;

/** Row of its own on the landing grid (split from the sign-off, Oct 17). */
export function ActivityBox() {
  return (
    <Box index={10} label="Activity" className="bx-activity">
      <Activity />
    </Box>
  );
}

/** A year of activity squares. Hovering darkens squares and leaves a fading
 *  trail (the playful bit carried over from the pixel "JP"), with a small box
 *  naming the day and date. */
export default function Activity() {
  const { cells, labels } = useMemo(() => buildGrid(new Date()), []);
  const figRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<{ text: string; x: number; y: number } | null>(null);

  // On narrow screens the year scrolls sideways — keep the latest months in
  // view, also after a resize or rotation changes the box's width.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const toEnd = () => {
      el.scrollLeft = el.scrollWidth;
    };
    toEnd();
    const ro = new ResizeObserver(toEnd);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // One listener for all 371 squares; the box is placed above the hovered one,
  // relative to the figure (outside the scroller, so it's never clipped).
  const onOver = (e: ReactPointerEvent<HTMLDivElement>) => {
    const cell = (e.target as HTMLElement).closest<HTMLElement>('[data-i]');
    const fig = figRef.current;
    const c = cell ? cells[Number(cell.dataset.i)] : null;
    if (!cell || !fig || !c) return;
    const r = cell.getBoundingClientRect();
    const f = fig.getBoundingClientRect();
    setTip({ text: tipText(c.date), x: r.left + r.width / 2 - f.left, y: r.top - f.top });
  };

  return (
    <figure ref={figRef} className="act" aria-label="Activity over the last year">
      <div ref={scrollRef} className="act-scroll" onScroll={() => setTip(null)}>
        <div className="act-inner">
          <div className="act-months" aria-hidden="true">
            {labels.map((l) => (
              <span key={`${l.col}-${l.text}`} style={{ gridColumn: `${l.col + 1} / span 4` }}>
                {l.text}
              </span>
            ))}
          </div>
          <div className="act-grid" aria-hidden="true" onPointerOver={onOver} onPointerLeave={() => setTip(null)}>
            {cells.map((c, i) =>
              c ? (
                <i key={i} className="act-cell" data-l={c.level} data-i={i} />
              ) : (
                <i key={i} className="act-cell act-cell--empty" />
              ),
            )}
          </div>
        </div>
      </div>
      {tip && (
        <span className="act-tip" role="tooltip" style={{ left: tip.x, top: tip.y }}>
          {tip.text}
        </span>
      )}
      <figcaption className="act-legend" aria-hidden="true">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <i key={l} className="act-cell" data-l={l} />
        ))}
        <span>More</span>
      </figcaption>
    </figure>
  );
}
