import { IconBrandLinkedin, IconFileCv, IconMail, IconPhone } from '@tabler/icons-react';
import { profile } from '../../data/portfolio';
import { getDailyQuote } from '../../data/quotes';
import { BoxLabel } from './Bento';

const LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jjp01/', Icon: IconBrandLinkedin },
  { label: 'Email', href: `mailto:${profile.email}`, Icon: IconMail },
  { label: 'Phone', href: `tel:${profile.phone}`, Icon: IconPhone },
  { label: 'Resume', href: profile.resumePath, Icon: IconFileCv },
] as const;

/** Last row: the quote of the day, contact links and credits. Replaces the
 *  old footer on the landing page. (The activity squares sit in their own
 *  row above it since Oct 17.) */
export default function SignOff() {
  const { text, author, source } = getDailyQuote();
  const year = new Date().getFullYear();

  return (
    <footer className="bx-box bx-signoff" aria-label="Sign-off">
      <div className="bx-box-in">
        <BoxLabel index={11} label="Sign-off" />
        <blockquote className="bx-quote">
          <p>“{text}”</p>
          <cite>— {author}{source ? `, ${source}` : ''}</cite>
        </blockquote>

        <div className="bx-signoff-foot">
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
          <p className="bx-credits">
            Designed &amp; built by <strong>{profile.name}</strong>. Set in Geist. © {year}
          </p>
        </div>
      </div>
    </footer>
  );
}
