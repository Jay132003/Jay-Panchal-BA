import type { ReactNode } from 'react';
import { motion } from 'motion/react';

const ease = [0.16, 1, 0.3, 1] as const;

type PageHeroProps = {
  /** Caption on the graph-paper strip, e.g. "Fig. 2." */
  figure: string;
  label: string;
  title: ReactNode;
  children?: ReactNode;
};

/** Top of a sub-page: a graph-paper strip, a mono label, a big title and an
 *  intro line — the sub-page counterpart of the landing cover. */
export default function PageHero({ figure, label, title, children }: PageHeroProps) {
  const rise = (d: number) => ({
    initial: { opacity: 0, y: 12, filter: 'blur(6px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 0.6, delay: d, ease },
  });

  return (
    <header className="gx-hero">
      <div className="gx-hero-strip gx-rule-bottom" aria-hidden="true">
        <span className="gx-cover-caption">
          <span className="gx-cover-fig">{figure}</span>
        </span>
      </div>
      <motion.p className="gx-hero-label gx-rule-bottom" {...rise(0.05)}>
        {label}
      </motion.p>
      <motion.h1 className="gx-hero-title gx-rule-bottom" {...rise(0.12)}>
        {title}
      </motion.h1>
      {children && (
        <motion.div className="gx-hero-intro gx-rule-bottom" {...rise(0.2)}>
          {children}
        </motion.div>
      )}
    </header>
  );
}
