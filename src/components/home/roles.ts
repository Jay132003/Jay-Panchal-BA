import type { ExperienceItem } from '../../data/portfolio';

export const LOGOS: Record<string, string> = {
  'Neome.ai':                     '/assets/Neome logo.png',
  'Brainybeam Info-Tech Pvt Ltd': '/assets/Brainybeam logo.jpeg',
  'QSpiders':                     '/assets/Qspiders logo.png',
};

/** "Brainybeam Info-Tech Pvt Ltd" → "role-brainybeam-info-tech-pvt-ltd" (Work page anchors). */
export const roleId = (company: string) => `role-${company.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '')}`;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function parseMonth(text: string): Date | null {
  const [mon, year] = text.trim().split(' ');
  const m = MONTHS.indexOf(mon);
  if (m < 0 || !year) return null;
  return new Date(Number(year), m, 1);
}

/** "Jun 2024 – Present" → { range: "06.2024—", duration: "2y 4m" } */
export function describePeriod(period: string) {
  const [startText, endText = ''] = period.split('–');
  const start = parseMonth(startText);
  const end = parseMonth(endText);
  if (!start) return { range: period, duration: '' };

  const fmt = (d: Date) => `${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
  const until = end ?? new Date();
  // Inclusive month count, so Jul–Aug reads as 2 months.
  const months = (until.getFullYear() - start.getFullYear()) * 12 + until.getMonth() - start.getMonth() + 1;
  const y = Math.floor(months / 12);
  const m = months % 12;

  return {
    range: `${fmt(start)}—${end ? fmt(end) : ''}`,
    duration: [y && `${y}y`, m && `${m}m`].filter(Boolean).join(' '),
  };
}

/** Months since year 0, so every role can sit on one time axis. */
const monthIndex = (d: Date) => d.getFullYear() * 12 + d.getMonth();

export function spanOf(job: ExperienceItem) {
  const [startText, endText = ''] = job.period.split('–');
  const start = parseMonth(startText) ?? new Date();
  const end = parseMonth(endText) ?? new Date();
  return { start: monthIndex(start), end: monthIndex(end) + 1 }; // end is exclusive
}

export const nowIndex = () => monthIndex(new Date()) + 1;
