import { IconBrandLinkedin, IconFileCv, IconMail, IconPhone } from '@tabler/icons-react';
import { profile } from '../../data/portfolio';
import { getDailyQuote } from '../../data/quotes';
import Activity from './Activity';
import { BoxLabel } from './Bento';
import SignedOff from './SignedOff';

const LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jjp01/', Icon: IconBrandLinkedin },
  { label: 'Email', href: `mailto:${profile.email}`, Icon: IconMail },
  { label: 'Phone', href: `tel:${profile.phone}`, Icon: IconPhone },
  { label: 'Resume', href: profile.resumePath, Icon: IconFileCv },
] as const;

/** Last row of every page: the quote of the day, contact links and Jay's signature.
 *  Replaces the old footer (on Work and About too since Oct 18). On the landing
 *  (Nov 1) it is the closing box: the activity squares sit on top and the
 *  contact links go, since Connect already has them. */
export default function SignOff({ index = 11, closing = false }: { index?: number; closing?: boolean }) {
  const { text, author, source } = getDailyQuote();

  return (
    <footer className={closing ? 'bx-box bx-signoff bx-signoff--closing' : 'bx-box bx-signoff'} aria-label="Sign-off">
      <div className="bx-box-in">
        <BoxLabel index={index} label="Sign-off" />
        {closing && <Activity />}
        <blockquote className="bx-quote">
          <p>“{text}”</p>
          <cite>— {author}{source ? `, ${source}` : ''}</cite>
        </blockquote>

        <div className="bx-signoff-foot">
          {!closing && <div className="gx-footer-links">
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
          </div>}
          <SignedOff name={profile.name} />
        </div>
      </div>
    </footer>
  );
}
