import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';

/** Round back-to-top button pinned bottom-right; slides in once the page has
 *  been scrolled. The header is the only nav (Jay, Oct 18). */
export default function BackToTop() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 320);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <AnimatePresence>
      {scrolled && (
        <motion.button
          key="to-top"
          type="button"
          className="gx-to-top"
          aria-label="Back to top"
          title="Back to top"
          onClick={toTop}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <ArrowUp aria-hidden />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
