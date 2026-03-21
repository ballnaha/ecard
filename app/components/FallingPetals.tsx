'use client';

import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@emotion/react';

// Optimized falling animation
const fall = keyframes`
  0% {
    transform: translateY(-10vh) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(100vh) translateX(100px) rotate(360deg);
    opacity: 0;
  }
`;

// Swaying animation to make it look natural
const sway = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(50px);
  }
`;

interface PetalProps {
  left: string;
  duration: string;
  delay: string;
  size: string;
  rotation: string;
}

const Petal = ({ left, duration, delay, size, rotation }: PetalProps) => (
  <Box
    sx={{
      position: 'fixed',
      top: '-5vh',
      left: left,
      width: size,
      height: size,
      backgroundColor: '#f8d7da', // Soft pink rose color
      borderRadius: '50% 0 50% 50%', // Leaf/Petal-like shape
      zIndex: 9999,
      pointerEvents: 'none',
      opacity: 0,
      filter: 'blur(0.5px)',
      animation: `${fall} ${duration} linear ${delay} infinite`,
      transform: `rotate(${rotation})`,
      willChange: 'transform, opacity', // Performance hint for browser
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '80%',
        height: '80%',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 'inherit',
      }
    }}
  />
);

export default function FallingPetals() {
  const [petals, setPetals] = useState<PetalProps[]>([]);

  useEffect(() => {
    // Generate petals only on client side to avoid hydration mismatch
    // We limit to 15-20 petals for best mobile performance
    const petalCount = 12;
    const newPetals: PetalProps[] = Array.from({ length: petalCount }).map(() => ({
      left: `${Math.random() * 100}vw`,
      duration: `${10 + Math.random() * 15}s`, // Slower fall (10-25s) is more cinematic
      delay: `${Math.random() * 10}s`,
      size: `${10 + Math.random() * 15}px`,
      rotation: `${Math.random() * 360}deg`,
    }));
    setPetals(newPetals);
  }, []);

  return (
    <Box sx={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {petals.map((props, i) => (
        <Petal key={i} {...props} />
      ))}
    </Box>
  );
}
