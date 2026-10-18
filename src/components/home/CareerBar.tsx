import { motion, useReducedMotion } from 'motion/react';
import { experiences } from '../../data/portfolio';
import { cn } from '../../lib/utils';
import { useLinkedHover } from './LinkedHover';
import { describePeriod, nowIndex, spanOf } from './roles';

const ease = [0.22, 1, 0.36, 1] as const;

type CareerBarProps = {
  /** Work page: taller lanes with the company and duration over each bar. */
  large?: boolean;
  /** Clicking a bar (Work page jumps to that role). */
  onPick?: (company: string) => void;
};

/** One lane per role on a shared year axis, with a green "Now" beat at the end
 *  of the current role. Bars draw in the order the jobs happened, and light up
 *  with the linked hover (roles ↔ tools). */
export default function CareerBar({ large = false, onPick }: CareerBarProps) {
  const still = useReducedMotion();
  const { setFocus, litCompanies } = useLinkedHover();
  const spans = experiences.map(spanOf);
  const axisStart = Math.floor(Math.min(...spans.map((s) => s.start)) / 12) * 12;
  const axisEnd = nowIndex();
  const total = axisEnd - axisStart;
  const pct = (m: number) => ((m - axisStart) / total) * 100;
  const years: number[] = [];
  for (let m = axisStart; m < axisEnd; m += 12) years.push(m / 12);
  const order = [...spans].sort((a, b) => a.start - b.start);

  return (
    <figure className={cn('bx-career', large && 'bx-career--large')} aria-hidden={!large || undefined}>
      <div className="bx-career-lanes">
        {experiences.map((job, i) => {
          const left = pct(spans[i].start);
          const width = pct(spans[i].end) - left;
          const state = litCompanies ? (litCompanies.has(job.company) ? 'lit' : 'dim') : undefined;
          const Tag = onPick ? 'button' : 'div';
          return (
            <Tag
              key={job.company}
              className="bx-career-lane"
              data-state={state}
              {...(onPick && {
                type: 'button' as const,
                onClick: () => onPick(job.company),
                'aria-label': `${job.company}, ${job.period} — jump to this role`,
              })}
              onPointerEnter={() => setFocus({ company: job.company })}
              onPointerLeave={() => setFocus(null)}
            >
              {large && (
                <span className="bx-career-name" style={{ left: `${Math.min(left, 72)}%` }}>
                  {job.company.replace(/ Info-Tech Pvt Ltd$/, '')}
                  <span className="bx-career-dur">{describePeriod(job.period).duration}</span>
                </span>
              )}
              <span className="bx-career-track">
                <motion.span
                  className="bx-career-bar"
                  title={`${job.company} · ${job.period}`}
                  style={{ left: `${left}%`, width: `${width}%`, originX: 0 }}
                  initial={still ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.9, delay: 0.3 + order.indexOf(spans[i]) * 0.35, ease }}
                />
                {job.isCurrent && <i className="bx-career-pulse" aria-hidden="true" />}
              </span>
            </Tag>
          );
        })}
      </div>
      <div className="bx-career-axis" aria-hidden="true">
        {years.map((y) => (
          <span key={y} style={{ left: `${pct(y * 12)}%` }}>{y}</span>
        ))}
        <span className="bx-career-now">Now</span>
      </div>
    </figure>
  );
}
