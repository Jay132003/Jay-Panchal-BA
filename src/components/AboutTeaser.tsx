import { motion } from 'motion/react';

const ease = [0.22, 1, 0.36, 1] as const;

export default function AboutTeaser() {
  const navigate = () => {
    window.location.hash = '#about';
  };

  return (
    <motion.section
      className="content-section about-teaser"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease }}
    >
      <p className="exp-label">About</p>

      <h2 className="about-teaser-headline">
        Quiet systems for{' '}
        <span className="about-teaser-headline-muted">loud problems.</span>
      </h2>

      <div className="about-teaser-bio">
        <p>
          I'm a Business Analyst and Solutions Engineer based in Ahmedabad, with a
          focus on AI-driven workflow automation, requirement analysis, and scalable
          low-code systems.
        </p>
        <p>
          Over the last few years I've translated complex business operations into
          optimised digital workflows that reduce manual effort, accelerate
          decision-making and improve process accuracy — across HR, CRM, logistics
          and manufacturing.
        </p>
        <p>
          I care about clarity. The best automation feels invisible: a stakeholder
          describes a messy reality and walks away with a system that simply behaves
          the way their business already thinks.
        </p>

        <button
          type="button"
          className="about-teaser-cta"
          onClick={navigate}
          aria-label="Read the full story about Jay Panchal"
        >
          Read the full story
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </motion.section>
  );
}
