import { capabilities } from '../data/portfolio';

export default function Capabilities() {
  return (
    <section id="skills" className="content-section">
      <h2>The craft behind the work.</h2>
      <div className="skills-grid">
        {capabilities.map((item) => (
          <div key={item.title} className="skill-card">
            <div className="skill-card-inner">
              <h3>{item.title}</h3>
              <div className="skill-tags">
                {item.tags.map((tag) => (
                  <span key={tag} className="skill-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
