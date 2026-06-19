'use client';
import { motion } from 'motion/react';
import type { Transition } from 'motion/react';
import type { CSSProperties } from 'react';

export type SpinningTextProps = {
  children: string;
  style?: CSSProperties;
  duration?: number;
  reverse?: boolean;
  fontSize?: number;
  radius?: number;
  transition?: Transition;
};

export function SpinningText({
  children,
  duration = 10,
  style,
  reverse = false,
  fontSize = 1,
  radius = 5,
  transition,
}: SpinningTextProps) {
  const letters = children.split('');
  const n = letters.length;

  return (
    <motion.div
      style={{ position: 'absolute', inset: 0, ...style }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ repeat: Infinity, ease: 'linear', duration, ...transition }}
    >
      {letters.map((letter, index) => (
        <span
          key={`${index}-${letter}`}
          aria-hidden='true'
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            display: 'inline-block',
            fontSize: `calc(${fontSize} * 1rem)`,
            transform: `translate(-50%, -50%) rotate(calc(360deg / ${n} * ${index})) translateY(calc(-1 * var(--spin-radius, ${radius}ch)))`,
            transformOrigin: 'center',
          }}
        >
          {letter}
        </span>
      ))}
      <span style={{
        position: 'absolute', width: 1, height: 1,
        padding: 0, margin: -1, overflow: 'hidden',
        clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
      }}>
        {children}
      </span>
    </motion.div>
  );
}
