'use client';

import React from 'react';
import { Box } from '@mui/material';
import HeroSection from './components/HeroSection';
import CoupleSection from './components/CoupleSection';
import GallerySection from './components/GallerySection';
import CountdownSection from './components/CountdownSection';
import ScheduleSection from './components/ScheduleSection';
import ColorThemeSection from './components/ColorThemeSection';
import GiftSection from './components/GiftSection';
import LocationSection from './components/LocationSection';
import RSVPSection from './components/RSVPSection';
import PoweredBy from './components/PoweredBy';
import FallingPetals from './components/FallingPetals';
import MobileNavigation from './components/MobileNavigation';

export default function WeddingECard() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', overflowX: 'hidden', backgroundColor: 'background.default', pb: { xs: 15, md: 0 } }}>
      
      {/* 0. Falling Petals Overlay (Performance Optimized) */}
      <FallingPetals />

      {/* 1. Hero Section (Seamless Video) */}
      <Box id="home">
        <HeroSection />
      </Box>

      {/* 2. Couple Section (Bride & Groom) */}
      <CoupleSection />

      {/* 4. Schedule Section (Planning our Special Day) */}
      <Box id="schedule">
        <ScheduleSection />
      </Box>

      {/* 2.5. Gallery Section (Our Memory) */}
      <Box id="gallery">
        <GallerySection />
      </Box>

      {/* 3. Countdown Section (Days until Forever) */}
      <CountdownSection />

      {/* 5. Color Theme Section (Elegant Dress Code) */}
      <ColorThemeSection />

      {/* 5.2 Gift Section (Gifts & Blessings) */}
      <GiftSection />

      {/* 6. RSVP Section (Confirm Attendance) */}
      <Box id="rsvp">
        <RSVPSection />
      </Box>

      {/* 7. Location Section (Map and Directions) */}
      <Box id="location">
        <LocationSection />
      </Box>

      {/* 8. Powered By Footer */}
      <PoweredBy />

      {/* 4. Mobile Navigation Footer */}
      <MobileNavigation />
    </Box>
  );
}
