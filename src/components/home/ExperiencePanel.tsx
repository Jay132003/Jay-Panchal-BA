import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Briefcase, MapPin, X } from 'lucide-react';
import { experiences } from '../../data/portfolio';
import { LOGOS, describePeriod } from './roles';

const ease = [0.22, 1, 0.36, 1] as const;

type Rect = { top: number; left: number; width: number; height: number };

/** Where the panel settles: centred, at most the grid's width. */
function target(): Rect {
  const width = Math.min(1080, window.innerWidth - 32);
  const height = Math.min(640, window.innerHeight - 96);
  return { top: (window.innerHeight - height) / 2 + 20, left: (window.innerWidth - width) / 2, width, height };
}

/** Experience → "Expand" (Nov 1): the box opens out into a panel over the
 *  page with every role in full — what Jay did, where, when and with which
 *  tools. It grows from the box's own outline and shrinks back into it, so
 *  the grid itself never moves. Esc, the backdrop or ✕ close it. */
export default function ExperiencePanel({ open, onClose, fromId }: { open: boolean; onClose: () => void; fromId: string }) {
  const [from, setFrom] = useState<Rect | null>(null);
  const [pick, setPick] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const still = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const r = document.getElementById(fromId)?.getBoundingClientRect();
    setFrom(r ? { top: r.top, left: r.left, width: r.width, height: r.height } : null);
    setPick(0);
    const back = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setPick((p) => (p + (e.key === 'ArrowDown' ? 1 : experiences.length - 1)) % experiences.length);
      }
    };
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = overflow;
      back?.focus?.();
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const job = experiences[pick];
  const { duration } = describePeriod(job.period);
  const end = target();
  const start = still || !from ? { ...end, opacity: 0 } : { ...from, opacity: 1 };

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="xp-backdrop"
            className="xp-backdrop"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            key="xp-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Experience"
            className="xp-panel"
            initial={start}
            animate={{ ...end, opacity: 1 }}
            exit={start}
            transition={{ duration: 0.5, ease }}
          >
            <motion.div
              className="xp-in"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.22, duration: 0.3 } }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
            >
              <header className="xp-head">
                <span className="bx-label">
                  <span>
                    <span className="bx-label-index">05</span>
                    <span className="bx-label-dash" aria-hidden="true">—</span>
                    Experience
                  </span>
                </span>
                <span className="xp-head-actions">
                  <a href="#work-page" className="bx-aside-link" onClick={onClose}>
                    Work page <ArrowRight aria-hidden="true" />
                  </a>
                  <button ref={closeRef} type="button" className="xp-close" onClick={onClose} aria-label="Close">
                    <X aria-hidden="true" />
                  </button>
                </span>
              </header>

              <div className="xp-body">
                <ol className="xp-roles" aria-label="Roles">
                  {experiences.map((j, i) => {
                    const logo = LOGOS[j.company];
                    return (
                      <li key={j.company}>
                        <button type="button" data-on={i === pick || undefined} onClick={() => setPick(i)}>
                          <span className="gx-company-logo">
                            {logo ? <img src={logo} alt="" /> : <Briefcase aria-hidden="true" />}
                          </span>
                          <span className="xp-role-text">
                            <span className="xp-role-company">{j.company.replace(/ Info-Tech Pvt Ltd$/, '')}</span>
                            <span className="xp-role-period">{j.period}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.article
                    key={job.company}
                    className="xp-detail"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease }}
                  >
                    <p className="xp-detail-meta">
                      {job.period}
                      {duration && <span className="gx-tabular"> · {duration}</span>}
                      <span className="xp-detail-where">
                        <MapPin aria-hidden="true" /> {job.location}
                      </span>
                    </p>
                    <h3 className="xp-detail-company">
                      {job.company}
                      {job.isCurrent && (
                        <span className="gx-badge-current">
                          <i aria-hidden="true" />
                          Current
                        </span>
                      )}
                    </h3>
                    <p className="xp-detail-role">{job.role}</p>
                    <ul className="xp-points">
                      {job.details.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                    {job.technologies && (
                      <ul className="xp-tools" aria-label="Tools">
                        {job.technologies.map((t) => (
                          <li key={t.name}>
                            <img src={t.icon} alt="" width={14} height={14} />
                            {t.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.article>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
