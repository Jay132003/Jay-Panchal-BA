import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Briefcase, ChevronDown, Globe } from 'lucide-react';
import { IconBrandLinkedin } from '@tabler/icons-react';
import { experiences, type ExperienceItem } from '../../data/portfolio';
import { cn } from '../../lib/utils';
import { Panel, Reveal } from './Panel';

export const LOGOS: Record<string, string> = {
  'Neome.ai':                     '/assets/Neome logo.png',
  'Brainybeam Info-Tech Pvt Ltd': '/assets/Brainybeam logo.jpeg',
  'QSpiders':                     '/assets/Qspiders logo.png',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseMonth(text: string): Date | null {
  const [mon, year] = text.trim().split(' ');
  const m = MONTHS.indexOf(mon);
  if (m < 0 || !year) return null;
  return new Date(Number(year), m, 1);
}

/** "Jun 2024 – Present" → { range: "06.2024—", duration: "2y 4m" } */
export function describePeriod(period: string) {
  const [startText, endText = ''] = period.split('–');
  const start = parseMonth(startText);
  const end = parseMonth(endText);
  if (!start) return { range: period, duration: '' };

  const fmt = (d: Date) => `${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
  const until = end ?? new Date();
  // Inclusive month count, so Jul–Aug reads as 2 months.
  const months = (until.getFullYear() - start.getFullYear()) * 12 + until.getMonth() - start.getMonth() + 1;
  const y = Math.floor(months / 12);
  const m = months % 12;

  return {
    range: `${fmt(start)}—${end ? fmt(end) : ''}`,
    duration: [y && `${y}y`, m && `${m}m`].filter(Boolean).join(' '),
  };
}

type WorkHistoryProps = {
  /** Work page: every role starts open and the "View all work" link is hidden. */
  expanded?: boolean;
};

export default function WorkHistory({ expanded = false }: WorkHistoryProps) {
  return (
    <Panel id={expanded ? undefined : 'work'} title="Experience" meta={expanded ? experiences.length : undefined}>
      <div className="gx-exp">
        {experiences.map((job, i) => (
          <Reveal key={job.company} delay={i * 0.05}>
            <Company job={job} defaultOpen={expanded || i === 0} />
          </Reveal>
        ))}
      </div>
      {!expanded && (
        <Reveal className="gx-panel-foot gx-rule-top">
          <a href="#work-page" className="gx-more">
            View all work <ArrowRight aria-hidden="true" />
          </a>
        </Reveal>
      )}
    </Panel>
  );
}

function Company({ job, defaultOpen }: { job: ExperienceItem; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const { range, duration } = describePeriod(job.period);
  const logo = LOGOS[job.company];

  return (
    <article className="gx-company">
      <header className="gx-company-head">
        <span className="gx-company-logo">
          {logo ? <img src={logo} alt="" /> : <Briefcase aria-hidden="true" />}
        </span>
        <h3 className="gx-company-name">{job.company}</h3>
        {job.website && (
          <a href={job.website} target="_blank" rel="noreferrer" className="gx-mini-btn" aria-label={`${job.company} website`}>
            <Globe />
          </a>
        )}
        {job.linkedIn && (
          <a href={job.linkedIn} target="_blank" rel="noreferrer" className="gx-mini-btn" aria-label={`${job.company} on LinkedIn`}>
            <IconBrandLinkedin size={14} stroke={1.7} />
          </a>
        )}
        {job.isCurrent && (
          <span className="gx-badge-current">
            <i aria-hidden="true" />
            Current
          </span>
        )}
      </header>

      <div className="gx-position">
        <button
          type="button"
          className="gx-position-head"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          <span className="gx-icon-box" aria-hidden="true">
            <Briefcase />
          </span>
          <span className="gx-position-text">
            <span className="gx-position-role">{job.role}</span>
            <span className="gx-position-meta">
              <span>{job.location}</span>
              <span className="gx-meta-sep" aria-hidden="true" />
              <span className="gx-tabular">{range}</span>
              {duration && (
                <>
                  <span className="gx-meta-sep" aria-hidden="true" />
                  <span>{duration}</span>
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
              <ul className="gx-bullets">
                {job.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {job.technologies && (
          <div className="gx-tags">
            {job.technologies.map((t) => (
              <span key={t.name} className="gx-tag">{t.name}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
