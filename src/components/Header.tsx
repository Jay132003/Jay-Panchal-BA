import { AnimatedThemeToggler } from './ui/animated-theme-toggler';

type HeaderProps = {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenPalette: () => void;
  activeSection?: string;
};

export default function Header({ isDark, onToggleTheme, onOpenPalette, activeSection }: HeaderProps) {
  return (
    <div className="site-header-wrapper">
    <header className="site-header">
      <a className="mark" href="#home" aria-label="Jay Panchal home">
        JP
      </a>
      <nav aria-label="Primary navigation">
        <a href="#home" className={activeSection === 'home' ? 'nav-active' : ''}>Home</a>
        <a href="#work" className={activeSection === 'work' ? 'nav-active' : ''}>Work</a>
        <a href="#skills" className={activeSection === 'skills' ? 'nav-active' : ''}>Skills</a>
        <a href="/assets/jay-panchal-resume.pdf" target="_blank" rel="noreferrer">
          Resume
        </a>
      </nav>
      <div className="header-actions">
        <button
          className="command-trigger"
          type="button"
          aria-label="Open command palette"
          onClick={onOpenPalette}
        >
          <span>⌕</span>
          <kbd>⌘ K</kbd>
        </button>
        <AnimatedThemeToggler
          className="icon-button theme-toggle"
          theme={isDark ? 'dark' : 'light'}
          onThemeChange={onToggleTheme}
          variant="circle"
          duration={500}
        />
      </div>
    </header>
    </div>
  );
}
