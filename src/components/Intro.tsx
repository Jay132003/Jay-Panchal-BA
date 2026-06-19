import { motion } from 'motion/react';
import {
  IconBrandLinkedin,
  IconWorld,
  IconMail,
  IconPhone,
} from '@tabler/icons-react';
import { profile, socialLinks } from '../data/portfolio';
import { SpinningText } from './core/spinning-text';

type TablerIcon = React.ComponentType<{ size?: number; stroke?: number }>;

const SOCIAL_ICONS: Record<string, TablerIcon> = {
  LinkedIn: IconBrandLinkedin,
  Website:  IconWorld,
  Email:    IconMail,
  Phone:    IconPhone,
};

// Hero elements start appearing as the loading screen exits (~1.05s)
const BASE = 1.05;
const ease = [0.25, 0.46, 0.45, 0.94] as const;

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

  const nameWords = profile.name.split(' ');
  const roleTitles = profile.role.split(' · ');

  return (
    <>
      <section id="home" className="intro" aria-labelledby="intro-title">
        {/* Avatar + spinning ring */}
        <motion.div
          className="avatar-ring"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.84, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.65, delay: BASE, ease: [0.34, 1.4, 0.64, 1] }}
        >
          <div className="avatar">
            <img src="/assets/avatar.png" alt={profile.name} />
          </div>
          <SpinningText
            radius={6}
            fontSize={0.62}
            duration={14}
            style={{ color: 'var(--muted)', fontWeight: 500, letterSpacing: '0.02em' }}
          >
            {`think • build • automate • `}
          </SpinningText>
        </motion.div>

        {/* Name + role */}
        <div>
          <h1 id="intro-title">
            {nameWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, filter: 'blur(5px)', y: 12 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: BASE + 0.08 + i * 0.1,
                  ease: 'easeOut',
                }}
                style={{ display: 'inline-block', marginRight: i < nameWords.length - 1 ? '0.28em' : 0 }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Desktop: single line */}
          <motion.p
            className="role"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: BASE + 0.32, ease }}
          >
            {profile.role} ·{' '}
            <button className="copy-email" type="button" onClick={handleCopyEmail}>
              {profile.email}{' '}
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: 'inline', verticalAlign: 'middle', marginBottom: '1px' }}>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </button>
          </motion.p>

          {/* Mobile: 3 separate lines */}
          <motion.div
            className="intro-meta"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: BASE + 0.32, ease }}
          >
            {roleTitles.map((title) => (
              <p key={title} className="role-line">{title}</p>
            ))}
            <button className="copy-email" type="button" onClick={handleCopyEmail}>
              {profile.email}{' '}
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: 'inline', verticalAlign: 'middle', marginBottom: '1px' }}>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Bio */}
      <motion.p
        className="bio"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: BASE + 0.48, ease }}
      >
        {profile.bio}
      </motion.p>

      {/* Status */}
      <motion.div
        className="status-line"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: BASE + 0.62, ease }}
      >
        <span className="status-dot" />
        {profile.status}
      </motion.div>

      {/* Social links — stagger each link */}
      <motion.div
        className="social-links"
        aria-label="Social links"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: BASE + 0.76, ease }}
      >
        {socialLinks.map((link) => {
          const Icon = SOCIAL_ICONS[link.label];
          return (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
              aria-label={link.label}
              title={link.label}
            >
              {Icon && <Icon size={20} stroke={1.6} />}
            </a>
          );
        })}
      </motion.div>
    </>
  );
}
