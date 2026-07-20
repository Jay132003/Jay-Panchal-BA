import { useState } from 'react';
import { motion } from 'motion/react';
import {
  IconBrandLinkedin,
  IconWorld,
  IconMail,
  IconPhone,
} from '@tabler/icons-react';
import { profile, socialLinks } from '../data/portfolio';
import { SpinningText } from './core/spinning-text';
import NowPlaying from './NowPlaying';
import AvatarPreview from './AvatarPreview';

const AVATAR_SRC = '/assets/Jay_New.png';

type TablerIcon = React.ComponentType<{ size?: number; stroke?: number }>;

const SOCIAL_ICONS: Record<string, TablerIcon> = {
  LinkedIn: IconBrandLinkedin,
  Website:  IconWorld,
  Email:    IconMail,
  Phone:    IconPhone,
};

// Strong, smooth decelerate — snappy in, gentle settle. Reads as intentional.
const ease = [0.16, 1, 0.3, 1] as const;

type IntroProps = {
  onCopyEmail: (email: string) => void;
  // true after loader exits; false on first render so delays sync with splash screen
  animReady?: boolean;
  // On first load, hold the hero cascade a beat so it plays as the curtain
  // clears (not hidden behind it). 0 on navigate-back (no curtain).
  revealDelay?: number;
};

export default function Intro({ onCopyEmail, animReady, revealDelay = 0 }: IntroProps) {
  // On initial load: wait for the loader before the hero cascade begins.
  // On navigate-back: no loader, so start (near) immediately.
  const BASE = animReady ? revealDelay : 1.05;
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      onCopyEmail(profile.email);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const [previewOpen, setPreviewOpen] = useState(false);
  const nameWords = profile.name.split(' ');
  const roleTitles = profile.role.split(' · ');

  return (
    <>
      <section id="home" className="intro" aria-labelledby="intro-title">
        {/* Avatar + spinning ring */}
        <motion.div
          className="avatar-ring"
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.85, delay: BASE, ease: [0.34, 1.35, 0.64, 1] }}
        >
          <button
            type="button"
            className="avatar"
            onClick={() => setPreviewOpen(true)}
            aria-label={`View photo of ${profile.name}`}
          >
            <img src={AVATAR_SRC} alt="" />
          </button>
          <SpinningText
            radius={6}
            fontSize={0.62}
            duration={14}
            style={{ color: 'var(--muted)', fontWeight: 500, letterSpacing: '0.02em', pointerEvents: 'none' }}
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
                initial={{ opacity: 0, filter: 'blur(8px)', y: 24 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: BASE + 0.15 + i * 0.1,
                  ease,
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
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: BASE + 0.45, ease }}
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
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: BASE + 0.45, ease }}
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
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: BASE + 0.62, ease }}
      >
        {profile.bio}
      </motion.p>

      {/* Status */}
      <motion.div
        className="status-line"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: BASE + 0.78, ease }}
      >
        <span className="status-dot" />
        {profile.status}
      </motion.div>

      {/* Now playing — background music */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: BASE + 0.9, ease }}
      >
        <NowPlaying />
      </motion.div>

      {/* Social links — stagger each link */}
      <motion.div
        className="social-links"
        aria-label="Social links"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: BASE + 1.02, ease }}
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

      <AvatarPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        src={AVATAR_SRC}
        alt={profile.name}
      />
    </>
  );
}
