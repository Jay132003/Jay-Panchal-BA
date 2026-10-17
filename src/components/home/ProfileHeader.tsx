import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { profile } from '../../data/portfolio';
import AvatarPreview from '../AvatarPreview';
import { Row } from './Bento';

const AVATAR_SRC = '/assets/Jay_New.png';
const ease = [0.22, 1, 0.36, 1] as const;

const TAGLINES = [
  'Business Analyst',
  'Solutions Engineer',
  'Workflow automation, end to end',
  profile.status,
];

type ProfileHeaderProps = {
  ready: boolean;
  delay: number;
  /** The "Three scripts" intro flies the name in itself, so it skips its own entrance. */
  nameFromIntro?: boolean;
};

/** Row 1 of the grid: the photo fills its own square cell, flush to the
 *  lines, and the name sits in the cell beside it. */
export default function ProfileHeader({ ready, delay, nameFromIntro = false }: ProfileHeaderProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const show = (d: number) => ({
    initial: { opacity: 0, y: 12, filter: 'blur(6px)' },
    animate: ready ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined,
    transition: { duration: 0.65, delay: delay + d, ease },
  });

  return (
    <Row cols="var(--bx-photo) 1fr" className="bx-profile">
      <section id="home" className="bx-box bx-photo-cell" aria-label="Photo">
        <motion.button
          type="button"
          className="bx-photo"
          onClick={() => setPreviewOpen(true)}
          aria-label={`View photo of ${profile.name}`}
          initial={{ opacity: 0, scale: 1.06, filter: 'blur(10px)' }}
          animate={ready ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : undefined}
          transition={{ duration: 0.9, delay, ease }}
        >
          <img src={AVATAR_SRC} alt="" />
        </motion.button>
      </section>

      <section className="bx-box bx-name-cell" aria-labelledby="profile-name">
        <motion.div className="bx-native" {...show(0.1)}>
          <span lang="gu">જય પંચાલ</span>
          <span aria-hidden="true">·</span>
          <span lang="hi">जय पंचाल</span>
        </motion.div>

        <motion.h1 id="profile-name" className="bx-name" {...(nameFromIntro ? {} : show(0.2))}>
          {profile.name}
          <VerifiedBadge />
        </motion.h1>

        <motion.div className="bx-tagline" {...show(0.3)}>
          <span className="bx-tagline-caret" aria-hidden="true">›</span>
          <FlipSentences sentences={TAGLINES} />
        </motion.div>
      </section>

      <AvatarPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        src={AVATAR_SRC}
        alt={profile.name}
      />
    </Row>
  );
}

function FlipSentences({ sentences }: { sentences: readonly string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % sentences.length), 2800);
    return () => window.clearInterval(id);
  }, [sentences.length]);

  return (
    <span className="bx-flip" aria-live="off">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {sentences[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function VerifiedBadge() {
  return (
    <svg className="bx-verified" viewBox="0 0 24 24" aria-label="Verified" role="img">
      <path
        fill="currentColor"
        d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944z"
      />
      <path
        d="M9 12l2 2l4 -4"
        fill="none"
        stroke="var(--bg)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
