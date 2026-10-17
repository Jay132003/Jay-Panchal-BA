import { useEffect, useState } from 'react';

/** Current time, re-rendered every `intervalMs`. */
export function useNow(intervalMs = 1000): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
}

const IST_OFFSET_MIN = 330; // UTC+5:30

/** Formats a time in Ahmedabad (IST), e.g. "12:04 AM". */
export function formatIST(date: Date, withSeconds = false): string {
  return date.toLocaleTimeString('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: withSeconds ? '2-digit' : undefined,
    hour12: true,
  });
}

/** "same time", "1h ahead", "4h 30m behind" — IST relative to the visitor. */
export function istDiffLabel(date: Date): string {
  const visitorOffset = -date.getTimezoneOffset();
  const diff = IST_OFFSET_MIN - visitorOffset;
  if (diff === 0) return 'same time';
  const abs = Math.abs(diff);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const span = `${h ? `${h}h` : ''}${h && m ? ' ' : ''}${m ? `${m}m` : ''}`;
  return `${span} ${diff > 0 ? 'ahead' : 'behind'}`;
}

/** "Good morning" / "Good afternoon" / "Good evening" for the visitor. */
export function greeting(date: Date): string {
  const h = date.getHours();
  if (h < 5) return 'Good night';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}
