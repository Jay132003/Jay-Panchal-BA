import Footer from './Footer';
import PageHero from './home/PageHero';
import WorkHistory from './home/WorkHistory';
import Stack from './home/Stack';
import { Panel, Reveal, Separator } from './home/Panel';
import { impactItems } from '../data/portfolio';

export function WorkPage() {
  return (
    <>
      <main className="gx-page">
        <div className="gx-col">
          <PageHero figure="Fig. 2." label="Work" title="A record of measurable outcomes.">
            <p>
              From development training at QSpiders to leading business analysis at Neome.ai —
              requirements, workflows and automation that ship and get used.
            </p>
          </PageHero>
          <Separator />

          <Panel title="Impact">
            <div className="gx-impact">
              {impactItems.map((item, i) => (
                <Reveal key={item.title} className="gx-impact-cell" delay={i * 0.05}>
                  <span className="gx-metric-value">{item.metric}</span>
                  <span className="gx-impact-title">{item.title}</span>
                  <p className="gx-impact-desc">{item.description}</p>
                </Reveal>
              ))}
            </div>
          </Panel>
          <Separator />

          <WorkHistory expanded />
          <Separator />

          <Stack />
        </div>
      </main>

      <Footer />
    </>
  );
}
