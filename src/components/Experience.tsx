import { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { experiences } from '../data/portfolio';

const ease = [0.22, 1, 0.36, 1] as const;

export default function Experience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [fillPct, setFillPct] = useState(0);

  useEffect(() => {
    const compute = () => {
      const el = rootRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrolled = vh * 0.65 - top;
      const pct = Math.min(100, Math.max(0, (scrolled / height) * 100));
      setFillPct(pct);
    };
    window.addEventListener('scroll', compute, { passive: true });
    compute();
    return () => window.removeEventListener('scroll', compute);
  }, []);

  return (
    <section id="work" className="content-section">
      <motion.p
        className="exp-label"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.4, ease }}
      >
        Work
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, delay: 0.06, ease }}
      >
        A record of measurable outcomes.
      </motion.h2>

      <div className="tl-root" ref={rootRef}>
        <div className="tl-track" aria-hidden="true">
          <div className="tl-fill" style={{ height: `${fillPct}%` }} />
        </div>

        {experiences.map((job, i) => (
          <motion.div
            key={job.company}
            className={`tl-entry${job.isCurrent ? ' tl-entry--active' : ''}`}
            initial={{ opacity: 0, y: 22, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: i * 0.13, duration: 0.55, ease }}
          >
            <span className="tl-node" aria-hidden="true">
              <span className="tl-node-core" />
            </span>

            <div className="tl-body">
              <div className="tl-entry-header">
                <div className="tl-entry-left">
                  <div className="tl-logo-box">
                    <CompanyLogo company={job.company} />
                  </div>
                  <div className="tl-entry-info">
                    <div className="tl-name-row">
                      <h3 className="tl-company">{job.company}</h3>
                      {job.website && (
                        <a
                          href={job.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tl-icon-btn"
                          aria-label={`${job.company} website`}
                        >
                          <GlobeIcon />
                        </a>
                      )}
                      {job.linkedIn && (
                        <a
                          href={job.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tl-icon-btn"
                          aria-label={`${job.company} on LinkedIn`}
                        >
                          <LinkedInIcon />
                        </a>
                      )}
                      {job.isCurrent && (
                        <span className="working"><i />Working</span>
                      )}
                    </div>
                    <span className="tl-role-text">{job.role}</span>
                  </div>
                </div>
                <div className="tl-entry-dates">
                  <span>{job.period}</span>
                  <small>{job.location}</small>
                </div>
              </div>

              {job.technologies && job.technologies.length > 0 && (
                <div className="tl-tech">
                  <p className="tl-tech-label">Technologies & Tools</p>
                  <div className="tl-chips">
                    {job.technologies.map((tech) => (
                      <span key={tech.name} className="tl-chip">
                        <img
                          src={tech.icon}
                          alt=""
                          aria-hidden="true"
                          width="15"
                          height="15"
                          className="tl-chip-img"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <ul className="tl-bullets">
                {job.details.map((d) => (
                  <li key={d}>
                    <CheckIcon />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const LOGOS: Record<string, string> = {
  'Neome.ai':                     '/assets/Neome logo.png',
  'Brainybeam Info-Tech Pvt Ltd': '/assets/Brainybeam logo.jpeg',
  'QSpiders':                     '/assets/Qspiders logo.png',
};

function CompanyLogo({ company }: { company: string }) {
  const src = LOGOS[company];
  if (!src) return null;
  return (
    <img src={src} alt={company} width="46" height="46" className="tl-logo-img" />
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 1.5C8 1.5 5.5 4.5 5.5 8s2.5 6.5 2.5 6.5M8 1.5C8 1.5 10.5 4.5 10.5 8S8 14.5 8 14.5" />
      <path d="M1.5 8h13" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.175-.431.57-.877 1.235-.877.87 0 1.219.662 1.219 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="tl-check-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeOpacity=".2" />
      <path d="M5 8.5l2.25 2.25L11 5.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
