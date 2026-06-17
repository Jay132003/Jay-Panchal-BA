import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out' | 'done'>('in');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 80);
    const t2 = setTimeout(() => setPhase('out'),  1000);
    const t3 = setTimeout(() => setPhase('done'), 1420);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === 'done') return null;

  return (
    <div className={`loader ${phase}`} aria-hidden="true">
      <div className="loader-mark">JP</div>
      <div className="loader-dots">
        <span /><span /><span />
      </div>
    </div>
  );
}
