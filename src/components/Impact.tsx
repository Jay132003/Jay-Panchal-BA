import { motion } from 'motion/react';
import { impactItems } from '../data/portfolio';

const ease = [0.22, 1, 0.36, 1] as const;

export default function Impact() {
  return (
    <section className="content-section">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease }}
      >
        Selected Impact
      </motion.h2>
      <div className="impact-list">
        {impactItems.map((item, i) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: i * 0.1, duration: 0.5, ease }}
          >
            <span className="metric">{item.metric}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
