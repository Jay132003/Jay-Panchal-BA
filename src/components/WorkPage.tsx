import { Fragment, useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { ArrowUpRight, Briefcase, MapPin } from 'lucide-react';
import { experiences, impactItems, type ExperienceItem } from '../data/portfolio';
import { arriveAt } from '../lib/arrival';
import { Bento, Box, Row } from './home/Bento';
import CareerBar from './home/CareerBar';
import { Odometer } from './home/Impact';
import { LinkedHoverProvider, useLinkedHover } from './home/LinkedHover';
import NextPage from './home/NextPage';
import { LOGOS, describePeriod, roleId } from './home/roles';
import SignOff from './home/SignOff';
import { StackBox } from './home/Stack';

/** The Work page on the landing grid (Oct 18): title + a large career bar,
 *  the three numbers, one row per role with everything shown (nothing opens
 *  or closes), every tool, then the way on to About. */
export function WorkPage() {
  // No intro here: the lines start drawing as soon as the page is in.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 60);
    return () => window.clearTimeout(t);
  }, []);

  const firstRole = 2 + impactItems.length; // box numbers run down the page
  const afterRoles = firstRole + experiences.length * 2;

  return (
    <LinkedHoverProvider>
      <div className="bx-page">
        <Bento ready={ready} delay={0.05}>
          <Row>
            <Box
              index={1}
              label="Work"
              aside={<span>{experiences.length} roles</span>}
              ready={ready}
              delay={0.2}
              className="bx-page-hero"
            >
              <h1 className="bx-page-title">A record of measurable outcomes.</h1>
              <p className="bx-page-intro">
                From development training at QSpiders to leading business analysis at Neome.ai —
                requirements, workflows and automation that ship and get used.
              </p>
              <CareerBar large onPick={(company) => arriveAt(roleId(company))} />
            </Box>
          </Row>

          <Row cols={`repeat(${impactItems.length}, minmax(0, 1fr))`} className="bx-work-impact">
            {impactItems.map((item, i) => (
              <Box key={item.title} index={2 + i} label="Impact" ready={ready} delay={0.35 + i * 0.08}>
                <Odometer value={item.metric} start={ready} delay={0.6 + i * 0.12} />
                <span className="bx-metric-title">{item.title}</span>
                <span className="bx-metric-desc">{item.description}</span>
              </Box>
            ))}
          </Row>

          {experiences.map((job, i) => (
            <RoleRow key={job.company} job={job} index={firstRole + i * 2} />
          ))}

          <Row>
            <StackBox index={afterRoles} wide />
          </Row>
          <Row>
            <NextPage index={afterRoles + 1} href="#about" title="About Jay" note="The story behind the work" />
          </Row>
          <Row>
            <SignOff index={afterRoles + 2} />
          </Row>
        </Bento>
      </div>
    </LinkedHoverProvider>
  );
}

/** Facts on the left, everything done there on the right. Hovering the row
 *  lights its bar in the career bar and its tools in Stack — nothing dims.
 *  As the bullets are read they ink in, the line between the two boxes fills
 *  down, and once the role is fully read its tools light up one by one. */
function RoleRow({ job, index }: { job: ExperienceItem; index: number }) {
  const { setFocus } = useLinkedHover();
  const { range, duration } = describePeriod(job.period);
  const logo = LOGOS[job.company];
  const rail = useRef<HTMLSpanElement>(null);
  const [read, setRead] = useState(0);
  const done = read === job.details.length;

  return (
    <Row
      cols="2fr 3fr"
      className="bx-role-row"
      onPointerEnter={() => setFocus({ company: job.company })}
      onPointerLeave={() => setFocus(null)}
    >
      <span ref={rail} className="bx-ink-rail" aria-hidden="true" />
      <Box id={roleId(job.company)} index={index} label={job.period} className="bx-role-facts">
        <span className="gx-company-logo bx-role-logo">
          {logo ? <img src={logo} alt="" /> : <Briefcase aria-hidden="true" />}
        </span>
        <h2 className="bx-role-name">
          {job.company}
          {job.isCurrent && (
            <span className="gx-badge-current">
              <i aria-hidden="true" />
              Current
            </span>
          )}
        </h2>
        <p className="bx-role-title">{job.role}</p>
        <p className="bx-role-where">
          <MapPin aria-hidden="true" />
          {job.location}
        </p>
        <p className="bx-role-when gx-tabular">
          {range}
          {duration && (
            <>
              <span className="gx-meta-sep" aria-hidden="true" />
              {duration}
            </>
          )}
        </p>
        {(job.website || job.linkedIn) && (
          <p className="bx-role-links">
            {job.website && (
              <a href={job.website} target="_blank" rel="noreferrer">
                Website <ArrowUpRight aria-hidden="true" />
              </a>
            )}
            {job.linkedIn && (
              <a href={job.linkedIn} target="_blank" rel="noreferrer">
                LinkedIn <ArrowUpRight aria-hidden="true" />
              </a>
            )}
          </p>
        )}
      </Box>

      <Box
        index={index + 1}
        label="What I did"
        aside={
          <span className="gx-tabular" aria-label={`${job.details.length} points`}>
            {read}/{job.details.length}
          </span>
        }
        className="bx-role-work"
      >
        <InkPoints points={job.details} rail={rail} onRead={setRead} />
        {job.technologies && (
          <ul className="bx-role-tools" aria-label="Tools used" data-done={done || undefined}>
            {job.technologies.map((t, i) => (
              <li key={t.name} style={{ '--i': i } as CSSProperties}>
                <img
                  src={t.icon}
                  alt=""
                  width={16}
                  height={16}
                  loading="lazy"
                  className="gx-chip-icon"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {t.name}
              </li>
            ))}
          </ul>
        )}
      </Box>
    </Row>
  );
}

/** "Ink as you read" (Oct 23): each bullet darkens word by word as the list
 *  scrolls up the screen, so the role being read is always the crispest thing
 *  on the page. Words are lit straight in the DOM, so scrolling never
 *  re-renders; React only hears how many bullets are fully read. */
function InkPoints({
  points,
  rail,
  onRead,
}: {
  points: string[];
  rail: RefObject<HTMLSpanElement | null>;
  onRead: (read: number) => void;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const still = useReducedMotion();
  const lit = useRef(0);
  const read = useRef(-1);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.55'] });
  // Index just past each bullet's last word, to count bullets fully read.
  const ends = points.reduce<number[]>((acc, p) => [...acc, (acc[acc.length - 1] ?? 0) + p.split(' ').length], []);

  const paint = (progress: number) => {
    const words = ref.current?.querySelectorAll<HTMLElement>('.bx-ink-w');
    if (!words) return;
    const p = still ? 1 : progress;
    const k = Math.round(p * words.length);
    for (let i = Math.min(k, lit.current); i < Math.max(k, lit.current); i++) words[i].toggleAttribute('data-lit', i < k);
    lit.current = k;
    if (rail.current) rail.current.style.transform = `scaleY(${p})`;
    const done = ends.filter((end) => end <= k).length;
    if (done !== read.current) {
      read.current = done;
      onRead(done);
    }
  };

  useMotionValueEvent(scrollYProgress, 'change', paint);
  useEffect(() => paint(scrollYProgress.get()), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ul ref={ref} className="gx-bullets bx-role-points">
      {points.map((point) => (
        <li key={point}>
          {point.split(' ').map((word, i) => (
            <Fragment key={i}>
              {i > 0 && ' '}
              <span className="bx-ink-w">{word}</span>
            </Fragment>
          ))}
        </li>
      ))}
    </ul>
  );
}
