import { useState } from 'react';
import { experiences } from '../data/portfolio';

export default function Experience() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleItem = (index: number) => {
    setOpenIndex((current) => (current === index ? -1 : index));
  };

  return (
    <section id="work" className="content-section">
      <h2>A record of measurable outcomes.</h2>
      <div className="experience-list">
        {experiences.map((job, index) => {
          const isOpen = openIndex === index;

          return (
            <article key={job.company} className={`experience-item${isOpen ? ' open' : ''}`}>
              <button
                className="experience-toggle"
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggleItem(index)}
              >
                <span className="job-main">
                  <span className="company-row">
                    <strong>{job.company}</strong>
                    {job.isCurrent && (
                      <span className="working"><i /> Working</span>
                    )}
                  </span>
                  <small>{job.role}</small>
                </span>
                <span className="job-meta">
                  {job.period}
                  <small>{job.location}</small>
                </span>
                <span className="expand-icon">{isOpen ? '−' : '+'}</span>
              </button>
              <div className="experience-details">
                {job.details.map((detail) => (
                  <p key={detail}>{detail}</p>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
