import { ArrowRight } from 'lucide-react';
import { whatIDo } from '../../data/portfolio';
import { greeting, useNow } from '../../hooks/useNow';
import { Box } from './Bento';

/** Short bio + what I do. The full story lives on the About page. */
export default function About({ ready, delay }: { ready: boolean; delay: number }) {
  const now = useNow(60_000);

  return (
    <Box
      id="about-teaser"
      index={2}
      label="About"
      aside={<span className="bx-greeting">{greeting(now)}</span>}
      ready={ready}
      delay={delay}
      className="bx-about"
    >
      <p className="bx-bio">
        I'm <strong>Jay Panchal</strong>, a Business Analyst and Solutions Engineer who turns messy
        business operations into calm, AI-driven workflows — across HR, CRM, logistics and
        manufacturing. The best automation feels invisible.
      </p>

      <div className="bx-about-foot">
        <div className="bx-pills">
          {whatIDo.map((item) => (
            <span key={item} className="bx-pill">{item}</span>
          ))}
        </div>
        <a href="#about" className="gx-more">
          Full story <ArrowRight aria-hidden="true" />
        </a>
      </div>
    </Box>
  );
}
