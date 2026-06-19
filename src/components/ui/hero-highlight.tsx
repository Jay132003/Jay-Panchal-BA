import { useMotionValue, useMotionTemplate, motion } from 'motion/react';
import React, { useState } from 'react';

function makeDotSvg(color: string) {
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Ccircle cx='8' cy='8' r='1.5' fill='${encodeURIComponent(color)}'/%3E%3C/svg%3E")`;
}

interface HeroHighlightProps {
  children: React.ReactNode;
  className?: string;
}

// className receives the card chrome (.quote-card) which must include
// overflow:hidden so the absolutely-positioned dot layers are clipped.
export function HeroHighlight({ children, className }: HeroHighlightProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [hovered, setHovered] = useState(false);

  const maskImage = useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, black 0%, transparent 100%)`;

  return (
    <div
      className={className}
      style={{ position: 'relative' }}
      onMouseMove={e => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* neutral dot grid — barely visible */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: makeDotSvg('rgba(120,120,120,0.07)'),
          backgroundSize: '16px 16px',
        }}
      />
      {/* accent dot grid — revealed by mouse radial mask */}
      <motion.div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: makeDotSvg('#818cf8'),
          backgroundSize: '16px 16px',
          WebkitMaskImage: maskImage,
          maskImage: maskImage,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 300ms ease',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}

interface HighlightProps {
  children: React.ReactNode;
}

export function Highlight({ children }: HighlightProps) {
  return (
    <motion.span
      initial={{ backgroundSize: '0% 100%' }}
      whileInView={{ backgroundSize: '100% 100%' }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 1.8, ease: 'linear', delay: 0.4 }}
      style={{
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left center',
        display: 'inline',
        backgroundImage: 'linear-gradient(to right, #a5b4fc, #c084fc)',
        paddingBottom: 3,
        paddingLeft: 4,
        paddingRight: 4,
        borderRadius: 6,
      }}
    >
      {children}
    </motion.span>
  );
}
