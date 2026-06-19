'use client';
import { motion } from 'motion/react';
import type { Transition, Variants } from 'motion/react';
import type { CSSProperties } from 'react';

export type SpinningTextProps = {
  children: string;
  style?: CSSProperties;
  duration?: number;
  className?: string;
  reverse?: boolean;
  fontSize?: number;
  radius?: number;
  transition?: Transition;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
};

const BASE_TRANSITION = { repeat: Infinity, ease: 'linear' } as const;

export function SpinningText({
  children,
  duration = 10,
  style,
  reverse = false,
  fontSize = 1,
  radius = 5,
  transition,
  variants,
}: SpinningTextProps) {
  const letters = children.split('');
  const totalLetters = letters.length;

  const finalTransition: Transition = {
    ...BASE_TRANSITION,
    duration,
    ...transition,
  };

  const containerVariants: Variants = {
    visible: { rotate: reverse ? -360 : 360 },
    ...variants?.container,
  };

  return (
    // position: absolute + inset: 0 fills the parent (.avatar-ring)
    // so each letter is centred on the ring's centre point
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        ...style,
      }}
      initial='hidden'
      animate='visible'
      variants={containerVariants}
      transition={finalTransition}
    >
      {letters.map((letter, index) => (
        <span
          aria-hidden='true'
          key={`${index}-${letter}`}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            display: 'inline-block',
            fontSize: `calc(${fontSize} * 1rem)`,
            // centres the char, rotates it to its arc position, then
            // moves it outward by `radius` character-widths (ch)
            transform: `
              translate(-50%, -50%)
              rotate(calc(360deg / ${totalLetters} * ${index}))
              translateY(calc(${radius} * -1ch))
            `,
            transformOrigin: 'center',
          }}
        >
          {letter}
        </span>
      ))}
      <span
        style={{
          // sr-only
          position: 'absolute', width: 1, height: 1,
          padding: 0, margin: -1, overflow: 'hidden',
          clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
        }}
      >
        {children}
      </span>
    </motion.div>
  );
}
