import { motion } from 'motion/react';
import { capabilities } from '../data/portfolio';

const ease = [0.22, 1, 0.36, 1] as const;

export default function Capabilities() {
  return (
    <section id="skills" className="content-section">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease }}
      >
        The craft behind the work.
      </motion.h2>
      <div className="skills-grid">
        {capabilities.map((item, i) => (
          <motion.div
            key={item.title}
            className="skill-card"
            initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: i * 0.09, duration: 0.52, ease }}
          >
            <div className="skill-card-inner">
              <h3>{item.title}</h3>
              <div className="skill-tags">
                {item.tags.map((tag) => (
                  <span key={tag} className="skill-tag">{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
