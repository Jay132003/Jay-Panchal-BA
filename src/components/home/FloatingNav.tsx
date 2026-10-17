import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { profile } from '../../data/portfolio';

type FloatingNavProps = {
  activeSection?: string;
  currentPage: 'home' | 'about' | 'work';
};

const ITEMS = [
  { label: 'Work', href: '#work', key: 'work' },
  { label: 'Skills', href: '#skills', key: 'skills' },
  { label: 'About', href: '#about', key: 'about-teaser' },
  { label: 'Contact', href: `mailto:${profile.email}`, key: 'contact' },
] as const;

/** Floating pill dock pinned to the bottom of the viewport, with a back-to-top
 *  button that slides in once the page has been scrolled. */
export default function FloatingNav({ activeSection, currentPage }: FloatingNavProps) {
  const [scrolled, setScrolled] = useState(false);
  // On the landing page the dock waits until the first screen (the hero grid)
  // has been scrolled past, so it never sits on top of it.
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 320);
      setPastHero(window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const active =
    currentPage === 'work' ? 'work' : currentPage === 'about' ? 'about-teaser' : activeSection;

  const visible = currentPage !== 'home' || pastHero;

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          className="gx-dock"
          aria-label="Quick navigation"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="gx-dock-pill">
            {ITEMS.map((item) => {
              const isActive = item.key === active;
              return (
                <a key={item.key} href={item.href} className="gx-dock-link" data-active={isActive || undefined}>
                  {isActive && (
                    <motion.span
                      layoutId="gx-dock-active"
                      className="gx-dock-active"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="gx-dock-text">{item.label}</span>
                </a>
              );
            })}
          </div>
          <AnimatePresence>
            {scrolled && (
              <motion.button
                type="button"
                className="gx-dock-top"
                aria-label="Scroll to top"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                initial={{ opacity: 0, scale: 0.6, x: -12 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.6, x: -12 }}
                transition={{ type: 'spring', stiffness: 420, damping: 30 }}
              >
                <ArrowUp aria-hidden="true" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
