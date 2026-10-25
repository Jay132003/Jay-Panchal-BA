import { ArrowRight } from 'lucide-react';
import { Box } from './Bento';
import { UntanglingBoard } from './Soon';

/** Box 10 (Oct 25): a teaser until Jay's first case study is written — its
 *  research pieces keep rearranging on the board. "View all" opens its page. */
export default function CaseStudy({ index = 10 }: { index?: number }) {
  return (
    <Box
      index={index}
      label="Case study"
      aside={<ViewAll href="#case-studies" />}
      className="bx-case"
    >
      <h3 className="cs-title">A new case study is being written.</h3>
      <UntanglingBoard />
      <p className="soon-note">The problem, the messy middle and what changed: the whole story, soon.</p>
    </Box>
  );
}

/** "View all →" in a box's label row. */
export function ViewAll({ href }: { href: string }) {
  return (
    <a href={href} className="bx-aside-link">
      View all <ArrowRight aria-hidden="true" />
    </a>
  );
}
