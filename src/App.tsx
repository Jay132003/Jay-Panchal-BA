import { useCallback, useEffect, useState } from 'react';
import Header from './components/Header';
import Intro from './components/Intro';
import Experience from './components/Experience';
import Impact from './components/Impact';
import Capabilities from './components/Capabilities';
import Education from './components/Education';
import Quote from './components/Quote';
import Footer from './components/Footer';
import CommandPalette from './components/CommandPalette';
import Toast from './components/Toast';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';
import { useTheme } from './hooks/useTheme';
import { useToast } from './hooks/useToast';
import { useActiveSection } from './hooks/useActiveSection';
import { useIntersection } from './hooks/useIntersection';

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const { message, visible, showToast } = useToast();
  const activeSection = useActiveSection(['home', 'work', 'skills']);
  useIntersection();
  const [paletteOpen, setPaletteOpen] = useState(false);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <LoadingScreen />
      <Header isDark={isDark} onToggleTheme={toggleTheme} onOpenPalette={openPalette} activeSection={activeSection} />
      <main className="page-shell">
        <Intro onCopyEmail={() => showToast('Email copied')} />
        <Experience />
        <Impact />
        <Capabilities />
        <Education />
        <Quote />
      </main>
      <Footer />
      <ScrollToTop />
      <CommandPalette open={paletteOpen} onClose={closePalette} />
      <Toast message={message} visible={visible} />
    </>
  );
}
