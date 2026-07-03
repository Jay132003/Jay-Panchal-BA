import { motion } from 'motion/react';
import Experience from './Experience';
import Quote from './Quote';
import Footer from './Footer';

const ease = [0.22, 1, 0.36, 1] as const;

const secV = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease },
  },
} as const;

export function WorkPage() {
  return (
    <>
      <motion.main
        className="page-shell"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.13, delayChildren: 0.08 } },
        }}
      >
        {/* Full experience — every entry expanded, no per-card toggle */}
        <motion.div variants={secV}>
          <Experience fullDetails />
        </motion.div>

        {/* Closing quote */}
        <motion.div variants={secV}>
          <Quote />
        </motion.div>
      </motion.main>

      <Footer />
    </>
  );
}
