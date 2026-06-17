import { AnimatedThemeToggler } from './ui/animated-theme-toggler';

type HeaderProps = {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenPalette: () => void;
  activeSection?: string;
};

const navLinks = [
  { label: 'Home',   href: '#home',                              section: 'home'   },
  { label: 'Work',   href: '#work',                              section: 'work'   },
  { label: 'Skills', href: '#skills',                            section: 'skills' },
  { label: 'Resume', href: '/assets/jay-panchal-resume.pdf',     section: ''       },
];

export default function Header({ isDark, onToggleTheme, onOpenPalette, activeSection }: HeaderProps) {
  return (
    <div className="site-header-wrapper">
      <header className="site-header">
        {/* Desktop nav — hidden on mobile */}
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navLinks.map(({ label, href, section }) => (
            <a
              key={label}
              href={href}
              className={section && activeSection === section ? 'nav-active' : ''}
              {...(section === '' ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              {label}
            </a>
          ))}
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

      {/* Mobile bottom nav pill — only visible on mobile */}
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navLinks.map(({ label, href, section }) => (
          <a
            key={label}
            href={href}
            className={`mobile-nav-link${section && activeSection === section ? ' mobile-nav-active' : ''}`}
            {...(section === '' ? { target: '_blank', rel: 'noreferrer' } : {})}
          >
            {label}
          </a>
        ))}
      </nav>
    </div>
  );
}
