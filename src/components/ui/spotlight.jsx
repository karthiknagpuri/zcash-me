'use client';

import React, { useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from 'framer-motion';

export function Spotlight({
  className,
  size = 200,
  springOptions = {
    stiffness: 26.7,
    damping: 4.1,
    mass: 0.2,
  },
}) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, springOptions);
  const ySpring = useSpring(y, springOptions);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX - size / 2);
    y.set(mouseY - size / 2);
  };

  const background = useMotionTemplate`radial-gradient(${size}px circle at ${xSpring}px ${ySpring}px, var(--spotlight-color, rgba(255,255,255,0.15)), transparent 80%)`;

  return (
    <motion.div
      ref={ref}
      className={`pointer-events-none absolute inset-0 ${className || ''}`}
      style={{
        background,
      }}
      onMouseMove={handleMouseMove}
    />
  );
}
