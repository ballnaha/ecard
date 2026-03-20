'use client';

import React from 'react';
import { Box } from '@mui/material';
import HeroSection from './components/HeroSection';
import CoupleSection from './components/CoupleSection';

export default function WeddingECard() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', overflowX: 'hidden', backgroundColor: 'background.default' }}>
      
      {/* 1. Hero Section (Seamless Video) */}
      <HeroSection />

      {/* 2. Couple Section (Bride & Groom) */}
      <CoupleSection />

    </Box>
  );
}
