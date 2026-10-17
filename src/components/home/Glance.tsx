import type { ReactNode } from 'react';
import { getDailyQuote } from '../../data/quotes';
import { cn } from '../../lib/utils';
import { Reveal } from './Panel';

/** The old "cards within cards" tile — only the About page's quote uses it now. */
function Card({
  label,
  aside,
  className,
  delay = 0,
  children,
}: {
  label: string;
  aside?: ReactNode;
  className?: string;
  delay?: number;
  children: ReactNode;
}) {
  return (
    <Reveal className={cn('gx-card', className)} delay={delay}>
      <div className="gx-card-inner">{children}</div>
      <div className="gx-card-foot">
        <span className="gx-label">{label}</span>
        {aside}
      </div>
    </Reveal>
  );
}

export function QuoteCard() {
  const { text, author, source } = getDailyQuote();

  return (
    <Card label="Quote of the day" className="gx-span-2" delay={0.1}>
      <blockquote className="gx-quote">
        <p>“{text}”</p>
        <cite>— {author}{source ? `, ${source}` : ''}</cite>
      </blockquote>
    </Card>
  );
}
