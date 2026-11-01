import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { Briefcase, Maximize2 } from 'lucide-react';
import { experiences, stackGroups, type ExperienceItem } from '../../data/portfolio';
import { Box, Row } from './Bento';
import ExperiencePanel from './ExperiencePanel';
import { LinkedHoverProvider, useLinkedHover } from './LinkedHover';
import { LOGOS, describePeriod } from './roles';

/** Role tool names that are spelled differently in the Stack grid. */
const ALIASES: Record<string, string> = { MySQL: 'SQL' };
const toolsOf = (company: string) =>
  (experiences.find((j) => j.company === company)?.technologies ?? []).map((t) => ALIASES[t.name] ?? t.name);
const TOOLS = stackGroups.flatMap((group) => group.items.map((item) => ({ ...item, group: group.title })));

type Focus = { company: string } | { tool: string } | null;

/** Row 5 — Experience ↔ Stack. Since Nov 1 Experience is the current role
 *  (what Jay does there, in four lines) over one quiet line per earlier role;
 *  "Expand" opens every role in full in a panel over the page, so the row
 *  never changes height. Hover a role and the tools used there turn to colour;
 *  hover a tool and the roles that used it underline in ink. Nothing dims. */
export default function LiveWiringRow() {
  return (
    <LinkedHoverProvider>
      <WiringRow />
    </LinkedHoverProvider>
  );
}

function WiringRow() {
  const rolesRef = useRef<HTMLOListElement>(null);
  const linked = useLinkedHover();
  const [focus, setLocal] = useState<Focus>(null);
  const [open, setOpen] = useState(false);

  // The Work page's career bar reads the shared linked-hover state, so keep both in step.
  const setFocus = (next: Focus) => {
    setLocal((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    linked.setFocus(next);
  };

  const litTools = focus ? new Set('company' in focus ? toolsOf(focus.company) : [focus.tool]) : null;
  const litCompanies = focus
    ? new Set(
        'company' in focus
          ? [focus.company]
          : experiences.filter((j) => toolsOf(j.company).includes(focus.tool)).map((j) => j.company),
      )
    : null;

  // Touch screens can't hover: when the row first shows, run through each
  // role once on its own, then rest.
  const inView = useInView(rolesRef, { once: true, margin: '-30% 0px' });
  useEffect(() => {
    if (!inView || !window.matchMedia('(hover: none)').matches) return;
    const timers = experiences.map((job, i) => window.setTimeout(() => setFocus({ company: job.company }), i * 2000));
    timers.push(window.setTimeout(() => setFocus(null), experiences.length * 2000));
    return () => timers.forEach(window.clearTimeout);
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

  const company = focus && 'company' in focus ? focus.company : null;

  return (
    <Row cols="11fr 9fr" className="lw-wiring" onPointerLeave={() => setFocus(null)}>
      <Box
        id="work"
        index={5}
        label="Experience"
        aside={
          <button type="button" className="bx-aside-link lw-expand" onClick={() => setOpen(true)} aria-haspopup="dialog">
            Expand <Maximize2 aria-hidden="true" />
          </button>
        }
        className="lw-exp"
      >
        <ol ref={rolesRef} className="lw-roles">
          {experiences.map((job) => (
            <li
              key={job.company}
              data-role={job.company}
              data-now={job.isCurrent || undefined}
              data-state={litCompanies?.has(job.company) ? 'lit' : undefined}
              onPointerEnter={() => setFocus({ company: job.company })}
              onPointerLeave={() => setFocus(null)}
            >
              {job.isCurrent ? <NowRole job={job} /> : <PastRole job={job} />}
            </li>
          ))}
        </ol>
      </Box>

      <Box
        index={6}
        label="Stack"
        aside={
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={company ?? 'all'}
              className={company ? 'lw-count' : 'gx-count lw-count'}
              initial={{ y: 10, opacity: 0, filter: 'blur(3px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: -10, opacity: 0, filter: 'blur(3px)' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {company ? `${toolsOf(company).length} of ${TOOLS.length} used` : TOOLS.length}
            </motion.span>
          </AnimatePresence>
        }
        className="bx-stack lw-stack"
      >
        <ul className="bx-tools">
          {TOOLS.map((tool) => (
            <li
              key={tool.name}
              data-tool={tool.name}
              className="bx-tool"
              title={`${tool.name} · ${tool.group}`}
              data-state={litTools?.has(tool.name) ? 'lit' : undefined}
              onPointerEnter={() => setFocus({ tool: tool.name })}
              onPointerLeave={() => setFocus(null)}
            >
              <img src={tool.icon} alt="" width={26} height={26} loading="lazy" className="bx-tool-icon" />
              <span className="bx-tool-name">{tool.name}</span>
            </li>
          ))}
        </ul>
      </Box>

      <ExperiencePanel open={open} onClose={() => setOpen(false)} fromId="work" />
    </Row>
  );
}

/** The role you're in now: logo, company, role, how long, and what Jay
 *  actually does there (`doing`, four short lines). */
function NowRole({ job }: { job: ExperienceItem }) {
  const { duration } = describePeriod(job.period);
  const logo = LOGOS[job.company];
  return (
    <span className="lw-now">
      <span className="lw-now-head">
        <span className="gx-company-logo">
          {logo ? <img src={logo} alt="" /> : <Briefcase aria-hidden="true" />}
        </span>
        <span className="lw-now-who">
          <span className="lw-now-company">
            <span className="lw-role-name">{job.company}</span>
          </span>
          <span className="lw-now-role">
            {job.role}
            <span className="gx-badge-current">
              <i aria-hidden="true" />
              Now
            </span>
          </span>
        </span>
        {duration && <span className="lw-now-dur gx-tabular">{duration}</span>}
      </span>
      {job.doing && (
        <ul className="lw-doing">
          {job.doing.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
    </span>
  );
}

/** An earlier role on one quiet line: year, company, role, duration. */
function PastRole({ job }: { job: ExperienceItem }) {
  const { duration } = describePeriod(job.period);
  const logo = LOGOS[job.company];
  return (
    <span className="lw-past">
      <span className="lw-past-year gx-tabular">{job.period.split(' – ')[0].split(' ')[1]}</span>
      <span className="gx-company-logo">
        {logo ? <img src={logo} alt="" /> : <Briefcase aria-hidden="true" />}
      </span>
      <span className="lw-past-text">
        <span className="lw-role-name">{job.company.replace(/ Info-Tech Pvt Ltd$/, '')}</span>
        <span className="lw-past-role">{job.role}</span>
      </span>
      {duration && <span className="lw-past-dur gx-tabular">{duration}</span>}
    </span>
  );
}
