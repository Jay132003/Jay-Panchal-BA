import { motion } from 'motion/react';

export default function LoadingScreen() {
  return (
    <motion.div
      className="loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06, filter: 'blur(14px)' }}
      transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      aria-hidden="true"
    >
      <motion.div
        className="loader-mark"
        initial={{ opacity: 0, scale: 0.8, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.55, ease: [0.34, 1.4, 0.64, 1] }}
      >
        JP
      </motion.div>
      <motion.div
        className="loader-dots"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
      >
        <span /><span /><span />
      </motion.div>
    </motion.div>
  );
}
