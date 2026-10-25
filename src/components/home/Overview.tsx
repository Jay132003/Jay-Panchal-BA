import type { CSSProperties, ReactNode } from 'react';
import { ArrowUpRight, Briefcase, Clock, Copy, MapPin, Mail } from 'lucide-react';
import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconFileCv,
  IconMail,
  IconPhone,
} from '@tabler/icons-react';
import { profile } from '../../data/portfolio';
import { formatIST, istDiffLabel, useNow } from '../../hooks/useNow';
import { Box } from './Bento';

type BoxTiming = { ready: boolean; delay: number };

/** The four facts worth knowing at a glance. */
export function QuickFacts({ onCopyEmail, ready, delay }: BoxTiming & { onCopyEmail: () => void }) {
  const now = useNow(15_000);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      onCopyEmail();
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <Box index={1} label="Quick facts" ready={ready} delay={delay}>
      <div className="bx-facts">
        <Fact icon={<Briefcase />}>
          Business Analyst{' '}
          <a href="https://neome.ai" target="_blank" rel="noreferrer" className="gx-link">
            @Neome.ai
          </a>
        </Fact>
        <Fact icon={<MapPin />}>Ahmedabad, India</Fact>
        <Fact icon={<Clock />}>
          <span className="gx-tabular">{formatIST(now)}</span>
          <span className="gx-dim"> // {istDiffLabel(now)}</span>
        </Fact>
        <Fact icon={<Mail />}>
          <button type="button" className="gx-copy" onClick={copyEmail} title="Copy email">
            {profile.email}
            <Copy aria-hidden="true" />
          </button>
        </Fact>
      </div>
    </Box>
  );
}

function Fact({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="bx-fact">
      <span className="bx-fact-icon" aria-hidden="true">{icon}</span>
      <div className="bx-fact-text">{children}</div>
    </div>
  );
}

// Hovering a row sweeps a soft wash of its brand colour across it, and the label
// rolls away letter by letter as a punchline rolls in (Oct 25).
const LINKS = [
  {
    label: 'Email',
    quip: 'Send me your messiest problem.',
    handle: profile.email,
    href: `mailto:${profile.email}`,
    Icon: IconMail,
    tint: '#ea4335',
  },
  {
    label: 'Phone',
    quip: 'Skip the meeting. Just call.',
    handle: '+91 96242 87628',
    href: `tel:${profile.phone}`,
    Icon: IconPhone,
    tint: '#12a4b8',
  },
  {
    label: 'LinkedIn',
    quip: 'Same guy. Better posture.',
    handle: 'in/jjp01',
    href: 'https://www.linkedin.com/in/jjp01/',
    Icon: IconBrandLinkedin,
    tint: '#0a66c2',
  },
  {
    label: 'Instagram',
    quip: 'Proof I have a life outside Jira.',
    handle: '@offx.jayyy',
    href: profile.instagram,
    Icon: IconBrandInstagram,
    tint: '#e1306c',
  },
  {
    label: 'Resume',
    quip: 'The trailer. Call me for the movie.',
    handle: 'Download PDF',
    href: profile.resumePath,
    Icon: IconFileCv,
    tint: '#45a557',
  },
] as const;

/** Email, phone, LinkedIn, Instagram and résumé — one hairline-separated row each. */
export function Connect({ ready, delay }: BoxTiming) {
  return (
    <Box index={4} label="Connect" ready={ready} delay={delay}>
      <ul className="bx-links">
        {LINKS.map(({ label, quip, handle, href, Icon, tint }) => {
          const external = href.startsWith('http') || href.endsWith('.pdf');
          return (
            <li key={label}>
              <a
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
                className="bx-link"
                aria-label={label}
                style={{ '--tint': tint } as CSSProperties}
              >
                <span className="bx-link-icon">
                  <Icon size={18} stroke={1.6} />
                </span>
                <span className="bx-link-text">
                  <span className="bx-link-label">
                    <Roll text={label} quip={quip} />
                  </span>
                  <span className="bx-link-handle">{handle}</span>
                </span>
                <ArrowUpRight className="bx-link-arrow" aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
    </Box>
  );
}

/** The label and its punchline stacked in one masked line, one span per letter so
 *  each can roll on its own beat. Screen readers get the link's aria-label instead. */
function Roll({ text, quip }: { text: string; quip: string }) {
  const letters = (str: string) =>
    [...str].map((ch, i) => (
      <span key={i} style={{ '--i': i } as CSSProperties}>
        {ch === ' ' ? '\u00a0' : ch}
      </span>
    ));
  return (
    <span className="bx-roll" aria-hidden="true">
      <span className="bx-roll-line">{letters(text)}</span>
      <span className="bx-roll-line bx-roll-quip">{letters(quip)}</span>
    </span>
  );
}
