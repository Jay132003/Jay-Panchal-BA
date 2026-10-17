import { IconBrandLinkedin, IconFileCv, IconMail, IconPhone } from '@tabler/icons-react';
import { profile } from '../data/portfolio';

const LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jjp01/', Icon: IconBrandLinkedin },
  { label: 'Email', href: `mailto:${profile.email}`, Icon: IconMail },
  { label: 'Phone', href: `tel:${profile.phone}`, Icon: IconPhone },
  { label: 'Resume', href: profile.resumePath, Icon: IconFileCv },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="gx-footer">
      <div className="gx-col">
        <div className="gx-sep" aria-hidden="true" />
        <div className="gx-footer-body gx-rule-top gx-rule-bottom">
          <p className="gx-footer-line">
            Designed &amp; built by <strong>{profile.name}</strong>. Set in Geist.
          </p>
          <p className="gx-footer-line gx-dim">
            Inspired by chanhdai.com &amp; marijanapav.com
          </p>
          <div className="gx-footer-links">
            {LINKS.map(({ label, href, Icon }) => {
              const external = href.startsWith('http') || href.endsWith('.pdf');
              return (
                <a
                  key={label}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noreferrer' : undefined}
                  aria-label={label}
                  title={label}
                >
                  <Icon size={17} stroke={1.6} />
                </a>
              );
            })}
          </div>
          <p className="gx-footer-copy">© {year} {profile.name}</p>
        </div>
        <div className="gx-sep" aria-hidden="true" />
      </div>
    </footer>
  );
}
