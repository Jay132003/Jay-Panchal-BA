import { motion } from 'motion/react';
import { quote } from '../data/portfolio';

export default function Quote() {
  const words = quote.text.split(' ');

  return (
    <motion.blockquote
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {'"'}
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 + i * 0.04, duration: 0.35, ease: 'easeOut' }}
          style={{ display: 'inline' }}
        >
          {word}{' '}
        </motion.span>
      ))}
      {'"'}
      <motion.cite
        initial={{ opacity: 0, y: 5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 + words.length * 0.04, duration: 0.4, ease: 'easeOut' }}
      >
        — {quote.author}
      </motion.cite>
    </motion.blockquote>
  );
}
