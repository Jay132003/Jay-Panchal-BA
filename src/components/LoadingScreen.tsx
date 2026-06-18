import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Remove static HTML splash — React loader (already at opacity 1) takes over instantly
    const splash = document.getElementById('splash');
    if (splash) splash.remove();

    const t1 = setTimeout(() => setExiting(true), 950);
    const t2 = setTimeout(() => setDone(true), 1350);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (done) return null;

  return (
    <div className={`loader${exiting ? ' loader--out' : ''}`} aria-hidden="true">
      <div className="loader-mark">JP</div>
      <div className="loader-dots">
        <span /><span /><span />
      </div>
    </div>
  );
}
