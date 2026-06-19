import { motion } from 'motion/react';
import { education } from '../data/portfolio';

const ease = [0.22, 1, 0.36, 1] as const;

export default function Education() {
  return (
    <section className="content-section education">
      <motion.p
        className="exp-label"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.4, ease }}
      >
        Education
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, delay: 0.06, ease }}
      >
        The foundation I built on.
      </motion.h2>
      <motion.div
        className="education-row"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55, delay: 0.12, ease }}
      >
        <div>
          <h3>{education.school}</h3>
          <p>{education.degree}</p>
        </div>
        <div className="education-meta">
          {education.year}
          <small>CGPA: {education.cgpa}</small>
        </div>
      </motion.div>
    </section>
  );
}
