import { ArrowRight, ArrowUpRight, Briefcase } from 'lucide-react';
import { experiences, type ExperienceItem } from '../../data/portfolio';
import { Box } from './Bento';
import CareerBar from './CareerBar';
import { useLinkedHover } from './LinkedHover';
import { LOGOS, describePeriod } from './roles';

type Hover = {
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
};

/** Jay's career at a glance (Oct 18): one bar per role on a shared time axis,
 *  then one line per role. No accordions — nothing here changes the box's
 *  height, so Stack beside it never stretches. The full story is on the Work page. */
export default function Experience() {
  const { setFocus, litCompanies } = useLinkedHover();
  const stateOf = (company: string) =>
    litCompanies ? (litCompanies.has(company) ? 'lit' : 'dim') : undefined;
  const hover = (company: string): Hover => ({
    onPointerEnter: () => setFocus({ company }),
    onPointerLeave: () => setFocus(null),
    onFocus: () => setFocus({ company }),
    onBlur: () => setFocus(null),
  });

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
      <CareerBar />

      <ol className="bx-roles">
        {experiences.map((job) => (
          <li key={job.company}>
            <Role job={job} state={stateOf(job.company)} hover={hover(job.company)} />
          </li>
        ))}
      </ol>
    </Box>
  );
}

function Role({ job, state, hover }: { job: ExperienceItem; state?: string; hover: Hover }) {
  const { duration } = describePeriod(job.period);
  const logo = LOGOS[job.company];

  return (
    <a href="#work-page" className="bx-role" data-state={state} {...hover}>
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
    </a>
  );
}
