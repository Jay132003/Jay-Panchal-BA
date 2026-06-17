import { useEffect, useRef, useState } from 'react';

export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0]);
  const idsRef = useRef(ids);

  useEffect(() => {
    const HEADER = 90;

    const detect = () => {
      // If the user has scrolled to the very bottom, activate the last section
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 60;
      if (atBottom) {
        setActive(idsRef.current[idsRef.current.length - 1]);
        return;
      }

      // Find the last section whose top edge has crossed the detection line
      let current = idsRef.current[0];
      for (const id of idsRef.current) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= HEADER) {
          current = id;
        }
      }
      setActive(current);
    };

    detect();
    window.addEventListener('scroll', detect, { passive: true });
    // scrollend fires after smooth-scroll animation fully settles
    window.addEventListener('scrollend', detect, { passive: true } as EventListenerOptions);
    return () => {
      window.removeEventListener('scroll', detect);
      window.removeEventListener('scrollend', detect);
    };
  }, []);

  return active;
}
