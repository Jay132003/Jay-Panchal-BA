import { motion } from 'motion/react';
import { education } from '../data/portfolio';

const ease = [0.22, 1, 0.36, 1] as const;

export default function Education() {
  return (
    <motion.section
      className="content-section education"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease }}
    >
      <h2>Education</h2>
      <div className="education-row">
        <div>
          <h3>{education.school}</h3>
          <p>{education.degree}</p>
        </div>
        <div className="education-meta">
          {education.year}
          <small>CGPA: {education.cgpa}</small>
        </div>
      </div>
    </motion.section>
  );
}
