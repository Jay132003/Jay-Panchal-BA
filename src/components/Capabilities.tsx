import { motion } from 'motion/react';
import { capabilities } from '../data/portfolio';
import {
  IconPresentationAnalytics,
  IconBolt,
  IconTerminal2,
  IconBrain,
} from '@tabler/icons-react';

const ease = [0.22, 1, 0.36, 1] as const;

const CARD_META = [
  {
    Icon: IconPresentationAnalytics,
    accent: '#6366f1',
    accentBg: 'rgba(99,102,241,0.1)',
    desc: 'Translating complex business needs into clear, actionable specifications.',
  },
  {
    Icon: IconBolt,
    accent: '#f59e0b',
    accentBg: 'rgba(245,158,11,0.1)',
    desc: 'Architecting automation logic and integration flows that scale.',
  },
  {
    Icon: IconTerminal2,
    accent: '#10b981',
    accentBg: 'rgba(16,185,129,0.1)',
    desc: 'Data, workflows, APIs, and design — the toolkit that makes it real.',
  },
  {
    Icon: IconBrain,
    accent: '#ec4899',
    accentBg: 'rgba(236,72,153,0.1)',
    desc: 'Bridging stakeholders, solving ambiguity, and driving clarity.',
  },
] as const;

export default function Capabilities() {
  return (
    <section id="skills" className="content-section">
      <motion.p
        className="exp-label"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.4, ease }}
      >
        Skills
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, delay: 0.06, ease }}
      >
        The craft behind the work.
      </motion.h2>

      <div className="skills-grid">
        {capabilities.map((item, i) => {
          const { Icon, accent, accentBg, desc } = CARD_META[i];
          return (
            <motion.div
              key={item.title}
              className="skill-card"
              style={{ '--sk-accent': accent, '--sk-accent-bg': accentBg } as React.CSSProperties}
              initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.09, duration: 0.52, ease }}
            >
              <div className="skill-card-inner">

                {/* header: icon + count badge */}
                <div className="sk-header">
                  <div className="sk-icon" style={{ background: accentBg }}>
                    <Icon size={20} strokeWidth={1.5} color={accent} />
                  </div>
                  <span className="sk-count">{item.tags.length}</span>
                </div>

                {/* title + desc */}
                <h3>{item.title}</h3>
                <p className="sk-desc">{desc}</p>

                {/* accent rule */}
                <div className="sk-rule" style={{ background: accent }} />

                {/* tags with staggered pop-in */}
                <div className="skill-tags">
                  {item.tags.map((tag, j) => (
                    <motion.span
                      key={tag}
                      className="skill-tag"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: i * 0.09 + j * 0.04 + 0.22,
                        duration: 0.28,
                        ease: 'easeOut',
                      }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
