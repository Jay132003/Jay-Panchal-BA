import { motion } from 'motion/react';

const ease = [0.22, 1, 0.36, 1] as const;

export default function AboutTeaser() {
  return (
    <motion.section
      id="about-teaser"
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

        <div className="flex justify-center mt-2">
          <a
            href="#about"
            className="group/cta relative flex h-10 w-44 items-center justify-center overflow-hidden rounded-xl border text-[13px] font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:border-[var(--text)]"
            style={{ background: 'var(--surface)', color: 'var(--text)', borderColor: 'var(--line)' }}
          >
            <span className="transition-transform duration-500 group-hover/cta:translate-x-44">
              Read the full story
            </span>
            <span className="absolute inset-0 flex items-center justify-center -translate-x-44 transition-transform duration-500 group-hover/cta:translate-x-0 text-lg">
              📖
            </span>
          </a>
        </div>
      </div>
    </motion.section>
  );
}
