import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Header from './components/Header';
import HomePage from './components/home/HomePage';
import BackToTop from './components/home/BackToTop';
import CommandPalette from './components/CommandPalette';
import Toast from './components/Toast';
import ScriptsIntro from './components/intro/ScriptsIntro';
import { AboutPage } from './components/about/AboutPage';
import { WorkPage } from './components/WorkPage';
import { useTheme } from './hooks/useTheme';
import { useToast } from './hooks/useToast';
import { useActiveSection } from './hooks/useActiveSection';
import { arriveAt } from './lib/arrival';

type Page = 'home' | 'about' | 'work';

function getPage(): Page {
  const hash = window.location.hash;
  if (hash === '#about') return 'about';
  if (hash === '#work-page') return 'work';
  return 'home';
}

const pageEase = [0.22, 1, 0.36, 1] as const;

/** The intro plays every time the landing page loads — first visit and every
 *  refresh (Jay, Oct 17) — but not when a link opens a sub-page or section,
 *  and never for people who've asked their system for reduced motion. */
function shouldPlayIntro(): boolean {
  const hash = window.location.hash;
  if (hash && hash !== '#home') return false;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const { message, visible, showToast } = useToast();
  const [paletteOpen, setPaletteOpen] = useState(false);
  // The old signature preloader is gone (Jay, Oct 17). Each load of the landing
  // page opens with the "Three scripts" intro (Jay's pick of three tried), which
  // lands the name on the grid and then lets the page in.
  const [intro, setIntro] = useState(shouldPlayIntro);
  const [sectionsReady, setSectionsReady] = useState(false);
  const [page, setPage] = useState<Page>(getPage);
  // Increment to force a full remount + re-stagger every time home is entered
  const [homeKey, setHomeKey] = useState(0);
  const activeSection = useActiveSection(['work', 'skills'], homeKey);

  useEffect(() => {
    const splash = document.getElementById('splash');
    if (splash) splash.remove();
    if (intro) return; // the intro calls onReveal when it's time
    // A timer, not rAF: rAF is paused in background tabs, which left the page blank.
    const t = window.setTimeout(() => setSectionsReady(true), 0);
    return () => window.clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const revealFromIntro = useCallback(() => setSectionsReady(true), []);
  const endIntro = useCallback(() => setIntro(false), []);

  useEffect(() => {
    const onChange = (e: HashChangeEvent) => {
      const next = getPage();
      const oldHash = new URL(e.oldURL).hash;
      const targetId = window.location.hash.replace('#', '');
      setPage(next);
      const leftSubpage = oldHash === '#about' || oldHash === '#work-page';

      if (next === 'home') {
        const toSection = Boolean(targetId) && targetId !== 'home';

        if (!leftSubpage && toSection) {
          // Already on home and jumping to a section (e.g. "Work" in the
          // header): the browser has scrolled to the anchor — don't remount or
          // snap back to the top, which made the first click land at the top.
          arriveAt(targetId);
          return;
        }

        // Force every section to remount and re-animate on every home visit
        setHomeKey(k => k + 1);

        if (leftSubpage && toSection) {
          // Coming from a full sub-page (About/Work) and aiming at a specific
          // section (e.g. clicking "Skills" while on the About page) — the
          // target element doesn't exist until the page-switch animation
          // finishes and the section remounts, so poll briefly for it instead
          // of just landing at the top.
          let attempts = 0;
          const tryScroll = () => {
            if (arriveAt(targetId)) return;
            if (attempts++ < 20) window.setTimeout(tryScroll, 40);
          };
          window.setTimeout(tryScroll, 260);
        } else {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
      } else {
        // Navigating to a full sub-page (About/Work) — always start at the top.
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen(open => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {intro && <ScriptsIntro onReveal={revealFromIntro} onDone={endIntro} />}

      <Header
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenPalette={openPalette}
        activeSection={activeSection}
        currentPage={page}
      />

      <AnimatePresence mode="wait">
        {page === 'home' ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: pageEase }}
          >
            {/* A quick fade only — the real intro is the grid drawing itself in
                and the boxes rising (see HomePage / Bento). */}
            <motion.main
              className="gx-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: sectionsReady ? 1 : 0 }}
              transition={{ duration: 0.4, ease: pageEase }}
            >
              <HomePage
                key={homeKey}
                onCopyEmail={() => showToast('Email copied')}
                ready={sectionsReady}
                revealDelay={homeKey === 0 ? 0.1 : 0}
                nameFromIntro={homeKey === 0 && intro}
              />
            </motion.main>
          </motion.div>
        ) : page === 'work' ? (
          <motion.div
            key="work"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: pageEase }}
          >
            <WorkPage />
          </motion.div>
        ) : (
          <motion.div
            key="about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: pageEase }}
          >
            <AboutPage />
          </motion.div>
        )}
      </AnimatePresence>

      <BackToTop />
      <CommandPalette open={paletteOpen} onClose={closePalette} />
      <Toast message={message} visible={visible} />
    </>
  );
}
