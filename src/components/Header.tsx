import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { AnimatedThemeToggler } from './ui/animated-theme-toggler';

type HeaderProps = {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenPalette: () => void;
  activeSection?: string;
  currentPage?: 'home' | 'about' | 'work';
};

// The JP monogram as a 7×5 pixel mark (same glyphs as the cover, smaller).
const MARK = [
  '###.###',
  '.#..#.#',
  '.#..###',
  '.#..#..',
  '##..#..',
];

function LogoMark() {
  return (
    <svg viewBox="0 0 7 5" className="gx-logo-mark" shapeRendering="crispEdges" aria-hidden="true">
      {MARK.flatMap((row, y) =>
        [...row].map((ch, x) => (ch === '#' ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" /> : null)),
      )}
    </svg>
  );
}

export default function Header({
  isDark,
  onToggleTheme,
  onOpenPalette,
  activeSection,
  currentPage = 'home',
}: HeaderProps) {
  const isActive = (key: string) =>
    (key === 'work' && (currentPage === 'work' || (currentPage === 'home' && activeSection === 'work'))) ||
    (key === 'skills' && currentPage === 'home' && activeSection === 'skills') ||
    (key === 'about' && (currentPage === 'about' || (currentPage === 'home' && activeSection === 'about-teaser')));

  const wide = currentPage === 'home';
  // On the landing grid the header has no rule of its own (the grid's top
  // line sits right under it); a full-width hairline appears once scrolled.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.div
      className="gx-header-wrap"
      data-wide={wide || undefined}
      data-scrolled={scrolled || undefined}
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <header className={wide ? 'gx-header gx-header--wide' : 'gx-header gx-rule-bottom'}>
        <a href="#home" className="gx-logo" aria-label="Jay Panchal — home">
          <LogoMark />
        </a>

        <nav className="gx-nav" aria-label="Primary navigation">
          <a href="#work" data-active={isActive('work') || undefined}>Work</a>
          <a href="#skills" data-active={isActive('skills') || undefined}>Skills</a>
          <a href="#about" data-active={isActive('about') || undefined}>About</a>
          <a href="/assets/jay-panchal-resume.pdf" target="_blank" rel="noreferrer">Resume</a>
        </nav>

        <div className="gx-header-actions">
          <button
            className="gx-search"
            type="button"
            aria-label="Open command palette"
            onClick={onOpenPalette}
          >
            <Search aria-hidden="true" />
            <span className="gx-search-text">Search…</span>
            <kbd>⌘K</kbd>
          </button>
          <AnimatedThemeToggler
            className="gx-icon-btn"
            theme={isDark ? 'dark' : 'light'}
            onThemeChange={onToggleTheme}
            variant="circle"
            duration={500}
          />
        </div>
      </header>
    </motion.div>
  );
}
