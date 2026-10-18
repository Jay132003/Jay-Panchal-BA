import { useEffect, useRef, useState } from 'react';

/** The id of the section sitting under the header right now, or '' when
 *  none of `ids` is there (e.g. the turntable, which has no header link).
 *  Oct 18: it used to keep the last section passed, so "About" stayed lit
 *  all the way down past the turntable. */
export function useActiveSection(ids: string[], resetKey = 0): string {
  const [active, setActive] = useState('');
  const idsRef = useRef(ids);

  useEffect(() => {
    const LINE = 72; // just below the 56px sticky header

    const detect = () => {
      let current = '';
      for (const id of idsRef.current) {
        const r = document.getElementById(id)?.getBoundingClientRect();
        if (r && r.top <= LINE && r.bottom > LINE) current = id;
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

  // A fresh home visit (homeKey change) starts with nothing lit; scrolling
  // updates it from there.
  useEffect(() => {
    if (resetKey === 0) return;
    setActive('');
  }, [resetKey]);

  return active;
}
