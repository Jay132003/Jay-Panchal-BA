import { capabilities } from '../data/portfolio';

export default function Capabilities() {
  return (
    <section id="skills" className="content-section">
      <h2>Capabilities</h2>
      <div className="link-cards">
        {capabilities.map((item) => (
          <article key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
