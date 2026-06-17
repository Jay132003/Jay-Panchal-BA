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
        <nav aria-label="Primary navigation">
          <a href="#home" className={activeSection === 'home' ? 'nav-active' : ''}>Home</a>
          <a href="#work" className={activeSection === 'work' ? 'nav-active' : ''}>Work</a>
          <a href="#skills" className={activeSection === 'skills' ? 'nav-active' : ''}>Skills</a>
          <a href="/assets/jay-panchal-resume.pdf" target="_blank" rel="noreferrer">Resume</a>
        </nav>
        <div className="header-actions">
          <button
            className="command-trigger"
            type="button"
            aria-label="Open command palette"
            onClick={onOpenPalette}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <kbd>⌘</kbd><kbd>K</kbd>
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
