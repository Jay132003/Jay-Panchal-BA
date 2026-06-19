import { motion } from 'motion/react';
import { HeroHighlight, Highlight } from './ui/hero-highlight';
import { getDailyQuote } from '../data/quotes';

export default function Quote() {
  const { text, author, source, highlight } = getDailyQuote();

  const idx = text.indexOf(highlight);
  const before  = idx >= 0 ? text.slice(0, idx) : text;
  const after   = idx >= 0 ? text.slice(idx + highlight.length) : '';

  return (
    <motion.div
      className="quote-wrapper"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <HeroHighlight className="quote-card">
        <blockquote>
          {before}
          <Highlight>{highlight}</Highlight>
          {after}
          <motion.cite
            initial={{ opacity: 0, y: 5 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.5, duration: 0.4, ease: 'easeOut' }}
          >
            — {author}{source ? `, ${source}` : ''}
          </motion.cite>
        </blockquote>
      </HeroHighlight>
    </motion.div>
  );
}
