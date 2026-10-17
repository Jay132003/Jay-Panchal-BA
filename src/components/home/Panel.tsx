import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

const ease = [0.22, 1, 0.36, 1] as const;

/** Fades a block up the first time it scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

type PanelProps = {
  id?: string;
  title?: ReactNode;
  /** Small mono note to the right of the title, e.g. a count. */
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** A section of the lined column: full-bleed rules above and below, a big
 *  title row, then content. */
export function Panel({ id, title, meta, children, className }: PanelProps) {
  return (
    <section id={id} className={cn('gx-panel gx-rule-top gx-rule-bottom', className)}>
      {title && (
        <Reveal className="gx-panel-header gx-rule-bottom">
          <h2 className="gx-panel-title">
            {title}
            {meta != null && <sup className="gx-panel-meta">{meta}</sup>}
          </h2>
        </Reveal>
      )}
      {children}
    </section>
  );
}

/** The diagonal-hatched band between panels. */
export function Separator({ className }: { className?: string }) {
  return <div className={cn('gx-sep', className)} aria-hidden="true" />;
}

/** Mono uppercase label — the small caps used on cards and meta rows. */
export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('gx-label', className)}>{children}</p>;
}
