import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { GraduationCap } from 'lucide-react';
import { capabilities, education, skillProof } from '../../data/portfolio';
import { Box } from './Bento';
import { Odometer } from './Impact';

const ease = [0.22, 1, 0.36, 1] as const;
const STAGES = ['Understand', 'Build', 'Land it'];
/** Seconds: when the beam reaches each stage, and the gap between skills. */
const stageAt = (i: number) => 0.25 + i * 0.75;
const TICK = 0.09;
const GLYPHS = 'abcdefghijklmnopqrstuvwxyz/<>{}=+*#';

/** Text that decodes into place left to right, like the intro's name —
 *  written straight to the DOM so nothing re-renders per frame. */
function Scramble({ text, run, delay }: { text: string; run: boolean; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const still = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !run || still) return;
    let raf = 0;
    const dur = 420 + text.length * 14;
    const timer = window.setTimeout(() => {
      const t0 = performance.now();
      el.dataset.on = '';
      const tick = (now: number) => {
        const done = Math.floor(((now - t0) / dur) * text.length);
        el.textContent =
          text.slice(0, done) +
          [...text.slice(done)].map((c) => (c === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join('');
        if (done < text.length) raf = requestAnimationFrame(tick);
        else el.textContent = text;
      };
      raf = requestAnimationFrame(tick);
    }, delay * 1000);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [run]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span ref={ref} className="hw-scramble" data-on={still ? '' : undefined} aria-label={text}>
      {text}
    </span>
  );
}

/** Row 6 — Skills as how Jay works (Oct 23): Understand → Build → Land it.
 *  A beam runs along the rail, each stage lights as it arrives and its skills
 *  tick on like a checklist. Hovering a skill shows where it was used, in a
 *  footer line of fixed height, so the row never changes size. */
export default function Skills({ index = 9 }: { index?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [hover, setHover] = useState<string | null>(null);
  const [auto, setAuto] = useState<string | null>(null);
  const all = capabilities.flatMap((g) => g.tags);

  // Touch screens: the proof line steps through the skills on its own.
  useEffect(() => {
    if (!inView || !window.matchMedia('(hover: none)').matches) return;
    let i = 0;
    const id = window.setInterval(() => setAuto(all[i++ % all.length]), 3000);
    return () => window.clearInterval(id);
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

  const shown = hover ?? auto;

  return (
    <Box id="skills" index={index} label="Skills" aside={<span>How I work</span>} className="hw-skills">
      <div ref={ref} className="hw-pipe" data-run={inView || undefined}>
        <div className="hw-rail" aria-hidden="true">
          <i className="hw-rail-beam" />
          <i className="hw-rail-end" />
        </div>

        <div className="hw-stages">
          {capabilities.map((group, i) => (
            <div key={group.title} className="hw-stage" style={{ '--at': `${stageAt(i)}s` } as CSSProperties}>
              <i className="hw-node" aria-hidden="true" />
              <p className="hw-stage-step">
                <span>{String(i + 1).padStart(2, '0')}</span> {STAGES[i]}
              </p>
              <p className="hw-stage-title">
                {group.title}
                <span className="gx-count">{group.tags.length}</span>
              </p>
              <ul className="hw-checks">
                {group.tags.map((tag, k) => {
                  const at = stageAt(i) + 0.15 + k * TICK;
                  return (
                    <li
                      key={tag}
                      data-on={shown === tag || undefined}
                      style={{ '--at': `${at}s` } as CSSProperties}
                      onPointerEnter={() => setHover(tag)}
                      onPointerLeave={() => setHover(null)}
                    >
                      {hover === tag && (
                        <motion.span
                          layoutId="hw-skill-hl"
                          className="hw-skill-hl"
                          transition={{ type: 'spring', stiffness: 460, damping: 36 }}
                        />
                      )}
                      <svg className="hw-check" viewBox="0 0 12 12" aria-hidden="true">
                        <path d="M2.2 6.4 4.9 9.1 9.8 3.2" pathLength={1} />
                      </svg>
                      <Scramble text={tag} run={inView} delay={at + 0.05} />
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="hw-proof" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={shown ?? 'hint'}
              initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
              transition={{ duration: 0.22, ease }}
            >
              {shown ? (
                <>
                  <span className="hw-proof-skill">{shown}</span>
                  <span className="hw-proof-arrow" aria-hidden="true">→</span>
                  {skillProof[shown]}
                </>
              ) : (
                <span className="hw-proof-hint">Hover a skill to see where I used it.</span>
              )}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </Box>
  );
}

const SEMESTERS = 8;
const GAUGE_R = 84;
const point = (frac: number): [number, number] => {
  const a = Math.PI - Math.PI * frac;
  return [100 + GAUGE_R * Math.cos(a), 100 - GAUGE_R * Math.sin(a)];
};

/** Education as a transcript (Oct 23): eight semester squares
 *  fill in, then the CGPA rolls in while a gauge draws to it. */
export function Education({ index = 8 }: { index?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const cgpa = Number(education.cgpa);
  const end = Number(education.year);
  const filled = SEMESTERS * 0.12 + 0.2;
  const [dx, dy] = point(cgpa / 10);

  return (
    <Box index={index} label="Education" className="bx-edu hw-edu">
      <div ref={ref} className="hw-edu-in" data-run={inView || undefined} style={{ '--filled': `${filled}s` } as CSSProperties}>
        <div className="bx-edu-body">
          <span className="gx-company-logo" aria-hidden="true">
            <GraduationCap />
          </span>
          <p className="bx-edu-school">{education.school}</p>
          <p className="bx-edu-degree">{education.degree.replace(/ \(BE\)$/, '')}</p>
        </div>

        <div className="hw-sems">
          <ol aria-label={`Eight semesters, ${end - 4} to ${end}`}>
            {Array.from({ length: SEMESTERS }, (_, i) => (
              <li key={i} title={`Semester ${i + 1}`} style={{ '--at': `${i * 0.12}s` } as CSSProperties} />
            ))}
          </ol>
          <p className="gx-tabular">
            <span>{end - 4}</span>
            <span>Class of {end}</span>
          </p>
        </div>

        <figure className="hw-gauge" aria-label={`CGPA ${education.cgpa} out of 10`}>
          <svg viewBox="0 0 200 106" aria-hidden="true">
            <path className="hw-gauge-track" d={`M16,100 A${GAUGE_R},${GAUGE_R} 0 0 1 184,100`} />
            {Array.from({ length: 9 }, (_, n) => {
              const k = n + 1;
              const a = Math.PI - (Math.PI * k) / 10;
              const r1 = GAUGE_R - 9;
              const r2 = GAUGE_R - (k % 5 === 0 ? 15 : 12);
              return (
                <line
                  key={k}
                  className="hw-gauge-tick"
                  x1={100 + r1 * Math.cos(a)}
                  y1={100 - r1 * Math.sin(a)}
                  x2={100 + r2 * Math.cos(a)}
                  y2={100 - r2 * Math.sin(a)}
                />
              );
            })}
            <path
              className="hw-gauge-fill"
              d={`M16,100 A${GAUGE_R},${GAUGE_R} 0 0 1 184,100`}
              pathLength={10}
              style={{ strokeDasharray: `${cgpa} 10`, '--cg': cgpa } as CSSProperties}
            />
            <circle className="hw-gauge-dot" cx={dx} cy={dy} r={4} />
          </svg>
          <figcaption>
            <Odometer value={education.cgpa} start={inView} delay={filled} />
            <span className="bx-edu-cgpa-label">CGPA / 10</span>
          </figcaption>
        </figure>
      </div>
    </Box>
  );
}
