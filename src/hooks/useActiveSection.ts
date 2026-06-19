import { useEffect, useRef, useState } from 'react';

export function useActiveSection(ids: string[], resetKey = 0): string {
  const [active, setActive] = useState(ids[0]);
  const idsRef = useRef(ids);

  useEffect(() => {
    const HEADER = 90;

    const detect = () => {
      // Guard: only treat as "at bottom" when user has actually scrolled.
      // Without this, on first load the DOM only has Intro so scrollHeight is
      // tiny, which makes atBottom=true and incorrectly snaps to the last id.
      const atBottom =
        window.scrollY > 50 &&
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 60;

      if (atBottom) {
        setActive(idsRef.current[idsRef.current.length - 1]);
        return;
      }

      let current = idsRef.current[0];
      for (const id of idsRef.current) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= HEADER) current = id;
      }
      setActive(current);
    };

    detect();
    window.addEventListener('scroll', detect, { passive: true });
    window.addEventListener('scrollend', detect, { passive: true } as EventListenerOptions);
    return () => {
      window.removeEventListener('scroll', detect);
      window.removeEventListener('scrollend', detect);
    };
  }, []);

  // Reset to 'home' whenever the caller signals a fresh page visit (homeKey change).
  // Scroll events will update it naturally as the user scrolls.
  useEffect(() => {
    if (resetKey === 0) return;
    setActive(ids[0]);
  }, [resetKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return active;
}
