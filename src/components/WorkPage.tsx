import { useEffect, useState } from 'react';
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
 *  lights its bar in the career bar and its tools in Stack. */
function RoleRow({ job, index }: { job: ExperienceItem; index: number }) {
  const { setFocus, litCompanies } = useLinkedHover();
  const { range, duration } = describePeriod(job.period);
  const logo = LOGOS[job.company];
  const dim = litCompanies && !litCompanies.has(job.company);

  return (
    <Row
      cols="2fr 3fr"
      className="bx-role-row"
      data-state={dim ? 'dim' : undefined}
      onPointerEnter={() => setFocus({ company: job.company })}
      onPointerLeave={() => setFocus(null)}
    >
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

      <Box index={index + 1} label="What I did" aside={<span>{job.details.length}</span>} className="bx-role-work">
        <ul className="gx-bullets bx-role-points">
          {job.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        {job.technologies && (
          <ul className="bx-role-tools" aria-label="Tools used">
            {job.technologies.map((t) => (
              <li key={t.name}>
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
