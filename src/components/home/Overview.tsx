import type { CSSProperties, ReactNode } from 'react';
import { ArrowUpRight, Briefcase, Clock, Copy, MapPin, Mail } from 'lucide-react';
import { IconBrandLinkedin, IconFileCv, IconMail } from '@tabler/icons-react';
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

const LINKS = [
  {
    label: 'LinkedIn',
    handle: 'in/jjp01',
    href: 'https://www.linkedin.com/in/jjp01/',
    Icon: IconBrandLinkedin,
    tint: '#0a66c2',
  },
  {
    label: 'Email',
    handle: profile.email,
    href: `mailto:${profile.email}`,
    Icon: IconMail,
    tint: '#ea4335',
  },
  {
    label: 'Resume',
    handle: 'Download PDF',
    href: profile.resumePath,
    Icon: IconFileCv,
    tint: '#45a557',
  },
] as const;

/** LinkedIn, email and résumé — one hairline-separated row each. */
export function Connect({ ready, delay }: BoxTiming) {
  return (
    <Box index={4} label="Connect" ready={ready} delay={delay}>
      <ul className="bx-links">
        {LINKS.map(({ label, handle, href, Icon, tint }) => {
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
                  <span className="bx-link-label">{label}</span>
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
