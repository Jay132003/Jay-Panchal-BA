import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Header from './components/Header';
import Intro from './components/Intro';
import Experience from './components/Experience';
import Impact from './components/Impact';
import Capabilities from './components/Capabilities';
import Education from './components/Education';
import AboutTeaser from './components/AboutTeaser';
import Quote from './components/Quote';
import Footer from './components/Footer';
import CommandPalette from './components/CommandPalette';
import Toast from './components/Toast';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';
import { AboutPage } from './components/about/AboutPage';
import { useTheme } from './hooks/useTheme';
import { useToast } from './hooks/useToast';
import { useActiveSection } from './hooks/useActiveSection';

type Page = 'home' | 'about';

function getPage(): Page {
  return window.location.hash === '#about' ? 'about' : 'home';
}

const pageEase = [0.22, 1, 0.36, 1] as const;

// Each section fades up when the stagger container reveals it
const secV = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const { message, visible, showToast } = useToast();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true);
  // Sections only mount after loader so whileInView can't fire during the splash
  const [sectionsReady, setSectionsReady] = useState(false);
  const [page, setPage] = useState<Page>(getPage);
  // Increment to force a full remount + re-stagger every time home is entered
  const [homeKey, setHomeKey] = useState(0);
  const activeSection = useActiveSection(['home', 'work', 'skills'], homeKey);

  useEffect(() => {
    const splash = document.getElementById('splash');
    if (splash) splash.remove();
    const t = setTimeout(() => {
      setLoaderVisible(false);
      setSectionsReady(true);
    }, 1050);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onChange = (e: HashChangeEvent) => {
      const next = getPage();
      const oldHash = new URL(e.oldURL).hash;
      setPage(next);
      if (next === 'about' || oldHash === '#about') {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
      if (next === 'home') {
        // Force every section to remount and re-animate on every home visit
        setHomeKey(k => k + 1);
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

  // Give Intro enough time to appear before sections roll in.
  // On first load: loader exits at 1.05s, sections mount then, 0.35s lets avatar settle.
  // On navigate-back: no loader, BASE=0 in Intro, 0.42s gives avatar a head start.
  const staggerDelay = sectionsReady && homeKey === 0 ? 0.35 : 0.42;

  return (
    <>
      <AnimatePresence>
        {loaderVisible && <LoadingScreen key="loader" />}
      </AnimatePresence>

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
            <main className="page-shell">
              {/* Intro always mounts first — it has its own animate (not whileInView) */}
              <Intro onCopyEmail={() => showToast('Email copied')} animReady={sectionsReady} />

              {/* All other sections only mount after the loader exits */}
              {sectionsReady && (
                <motion.div
                  key={homeKey}
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: {},
                    show: {
                      transition: {
                        staggerChildren: 0.13,
                        delayChildren: staggerDelay,
                      },
                    },
                  }}
                >
                  <motion.div variants={secV}><Experience /></motion.div>
                  <motion.div variants={secV}><Impact /></motion.div>
                  <motion.div variants={secV}><Capabilities /></motion.div>
                  <motion.div variants={secV}><Education /></motion.div>
                  <motion.div variants={secV}><AboutTeaser /></motion.div>
                  <motion.div variants={secV}><Quote /></motion.div>
                </motion.div>
              )}
            </main>
            {sectionsReady && <Footer />}
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

      <ScrollToTop />
      <CommandPalette open={paletteOpen} onClose={closePalette} />
      <Toast message={message} visible={visible} />
    </>
  );
}
