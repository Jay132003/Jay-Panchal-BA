import { profile, socialLinks } from '../data/portfolio';

type IntroProps = {
  onCopyEmail: (email: string) => void;
};

export default function Intro({ onCopyEmail }: IntroProps) {
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      onCopyEmail(profile.email);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <>
      <section id="home" className="intro" aria-labelledby="intro-title">
        <div className="avatar" aria-hidden="true">
          <img src="/assets/avatar.png" alt={profile.name} />
        </div>
        <div>
          <h1 id="intro-title">{profile.name}</h1>
          <p className="role">
            {profile.role} ·{' '}
            <button className="copy-email" type="button" onClick={handleCopyEmail}>
              {profile.email}{' '}
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{display:'inline',verticalAlign:'middle',marginBottom:'1px'}}>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </button>
          </p>
        </div>
      </section>

      <p className="bio">{profile.bio}</p>

      <div className="status-line">
        <span className="status-dot" />
        {profile.status}
      </div>

      <div className="social-links" aria-label="Social links">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
          >
            {link.label}
          </a>
        ))}
      </div>
    </>
  );
}
