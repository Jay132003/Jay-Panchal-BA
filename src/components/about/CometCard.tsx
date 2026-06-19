import React from 'react';

const COMETS = [
  { top: '4%',  left: '-18%', angle: 42, delay: '0s',    dur: '4.5s', len: 150 },
  { top: '-8%', left: '22%',  angle: 48, delay: '1.9s',  dur: '3.8s', len: 110 },
  { top: '28%', left: '-14%', angle: 36, delay: '3.1s',  dur: '5.2s', len: 130 },
  { top: '-6%', left: '58%',  angle: 52, delay: '0.8s',  dur: '4.2s', len: 95  },
  { top: '58%', left: '-12%', angle: 38, delay: '2.5s',  dur: '3.6s', len: 85  },
  { top: '-5%', left: '80%',  angle: 45, delay: '1.4s',  dur: '4.9s', len: 140 },
];

export function CometCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`comet-card${className ? ` ${className}` : ''}`}>
      <div className="comet-layer" aria-hidden="true">
        {COMETS.map((c, i) => (
          <span
            key={i}
            className="comet"
            style={{
              top: c.top,
              left: c.left,
              '--c-angle': `${c.angle}deg`,
              '--c-delay': c.delay,
              '--c-dur': c.dur,
              '--c-len': `${c.len}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>
      <div className="comet-card-content">{children}</div>
    </div>
  );
}
