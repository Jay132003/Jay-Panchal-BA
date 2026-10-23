import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { ArrowRight, ArrowUpRight, Briefcase } from 'lucide-react';
import { experiences, stackGroups, type ExperienceItem } from '../../data/portfolio';
import { Box, Row } from './Bento';
import CareerBar from './CareerBar';
import { LinkedHoverProvider, useLinkedHover } from './LinkedHover';
import { LOGOS, describePeriod, nowIndex, spanOf } from './roles';

/** Role tool names that are spelled differently in the Stack grid. */
const ALIASES: Record<string, string> = { MySQL: 'SQL' };
const toolsOf = (company: string) =>
  (experiences.find((j) => j.company === company)?.technologies ?? []).map((t) => ALIASES[t.name] ?? t.name);
const TOOLS = stackGroups.flatMap((group) => group.items.map((item) => ({ ...item, group: group.title })));

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type Focus = { company: string } | { tool: string } | null;

/** Row 5 — Experience ↔ Stack (Oct 23). Hover a role and the tools used there
 *  simply turn to colour in Stack; hover a tool and the roles that used it
 *  underline in ink. Kept deliberately plain — Jay found drawn wires and a
 *  ripple "too much" — and nothing dims: hover only adds. */
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

  // The career bar reads the shared linked-hover state, so keep both in step.
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
      <Box id="work" index={6} label="Experience" aside={<a href="#work-page" className="bx-aside-link">View all work <ArrowRight aria-hidden="true" /></a>} className="lw-exp">
        <Playhead onFocus={setFocus} />
        <ol ref={rolesRef} className="bx-roles lw-roles">
          {experiences.map((job) => (
            <li
              key={job.company}
              data-role={job.company}
              data-state={litCompanies?.has(job.company) ? 'lit' : undefined}
              onPointerEnter={() => setFocus({ company: job.company })}
              onPointerLeave={() => setFocus(null)}
            >
              {company === job.company && (
                <motion.span
                  layoutId="lw-role-hl"
                  className="lw-role-hl"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <RoleLine job={job} />
            </li>
          ))}
        </ol>
      </Box>

      <Box
        index={7}
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

    </Row>
  );
}

function RoleLine({ job }: { job: ExperienceItem }) {
  const { duration } = describePeriod(job.period);
  const logo = LOGOS[job.company];
  return (
    <span className="bx-role">
      <span className="gx-company-logo">
        {logo ? <img src={logo} alt="" /> : <Briefcase aria-hidden="true" />}
      </span>
      <span className="bx-role-text">
        <span className="bx-role-company">
          <span className="lw-role-name">{job.company}</span>
          {job.isCurrent && (
            <span className="gx-badge-current">
              <i aria-hidden="true" />
              Current
            </span>
          )}
        </span>
        <span className="bx-role-meta">
          {job.role}
          {duration && (
            <>
              <span className="gx-meta-sep" aria-hidden="true" />
              <span className="gx-tabular">{duration}</span>
            </>
          )}
        </span>
        <span className="bx-role-headline">{job.headline}</span>
      </span>
      <ArrowUpRight className="bx-role-arrow" aria-hidden="true" />
    </span>
  );
}

/** Scrub the career bar: a playhead follows the pointer with the month and
 *  the role you were in then — and Stack follows the playhead. */
function Playhead({ onFocus }: { onFocus: (f: Focus) => void }) {
  const [at, setAt] = useState<{ x: number; frac: number; label: string } | null>(null);
  const spans = experiences.map(spanOf);
  const axisStart = Math.floor(Math.min(...spans.map((s) => s.start)) / 12) * 12;
  const total = nowIndex() - axisStart;

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const frac = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 0.9999);
    const month = axisStart + Math.floor(frac * total);
    // Latest-started role wins where two overlap (Jun–Jul 2024).
    const here = experiences
      .map((job, i) => ({ job, s: spans[i] }))
      .filter(({ s }) => month >= s.start && month < s.end)
      .sort((a, b) => b.s.start - a.s.start)[0]?.job;
    const name = here ? here.company.replace(/ Info-Tech Pvt Ltd$/, '') : 'Between roles';
    setAt({ x: e.clientX - r.left, frac, label: `${MONTHS[month % 12]} ${Math.floor(month / 12)} · ${name}` });
    onFocus(here ? { company: here.company } : null);
  };

  return (
    <div
      className="lw-playhead-zone"
      data-scrub={at ? '' : undefined}
      onPointerMove={move}
      onPointerLeave={() => {
        setAt(null);
        onFocus(null);
      }}
    >
      <CareerBar />
      {at && (
        <>
          <span className="lw-playhead" style={{ left: at.x }} />
          {/* Sits in the year row (the years step aside), kept inside the box */}
          <span className="lw-playhead-tag" style={{ left: at.x, translate: `${-at.frac * 100}% 0` }}>
            {at.label}
          </span>
        </>
      )}
    </div>
  );
}
