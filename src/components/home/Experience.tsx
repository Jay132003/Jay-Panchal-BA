import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Briefcase, ChevronDown } from 'lucide-react';
import { experiences, type ExperienceItem } from '../../data/portfolio';
import { cn } from '../../lib/utils';
import { Box } from './Bento';
import { LOGOS, describePeriod } from './WorkHistory';

/** Current role open, earlier roles one line each — the Work page has the rest. */
export default function Experience() {
  return (
    <Box
      id="work"
      index={6}
      label="Experience"
      aside={
        <a href="#work-page" className="bx-aside-link">
          View all work <ArrowRight aria-hidden="true" />
        </a>
      }
      className="bx-exp"
    >
      <div className="bx-roles">
        {experiences.map((job, i) => (
          <Role key={job.company} job={job} defaultOpen={i === 0} />
        ))}
      </div>
    </Box>
  );
}

function Role({ job, defaultOpen }: { job: ExperienceItem; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const { range, duration } = describePeriod(job.period);
  const logo = LOGOS[job.company];

  return (
    <article className={cn('bx-role', open && 'is-open')}>
      <button type="button" className="bx-role-head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="gx-company-logo">
          {logo ? <img src={logo} alt="" /> : <Briefcase aria-hidden="true" />}
        </span>
        <span className="bx-role-text">
          <span className="bx-role-company">
            {job.company}
            {job.isCurrent && (
              <span className="gx-badge-current">
                <i aria-hidden="true" />
                Current
              </span>
            )}
          </span>
          <span className="bx-role-meta">
            {job.role}
            <span className="gx-meta-sep" aria-hidden="true" />
            <span className="gx-tabular">{range}</span>
            {duration && (
              <>
                <span className="gx-meta-sep" aria-hidden="true" />
                {duration}
              </>
            )}
          </span>
        </span>
        <ChevronDown className={cn('gx-chevron', open && 'gx-chevron--open')} aria-hidden="true" />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <ul className="gx-bullets bx-role-bullets">
              {job.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
