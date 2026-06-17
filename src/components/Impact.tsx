import { impactItems } from '../data/portfolio';

export default function Impact() {
  return (
    <section className="content-section">
      <h2>Selected Impact</h2>
      <div className="impact-list">
        {impactItems.map((item) => (
          <article key={item.title}>
            <span className="metric">{item.metric}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
