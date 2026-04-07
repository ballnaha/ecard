'use client';

import React from 'react';
import { Box } from '@mui/material';
import HeroSection from '@/app/components/HeroSection';
import CoupleSection from '@/app/components/CoupleSection';
import GallerySection from '@/app/components/GallerySection';
import CountdownSection from '@/app/components/CountdownSection';
import ScheduleSection from '@/app/components/ScheduleSection';
import GiftSection from '@/app/components/GiftSection';
import LocationSection from '@/app/components/LocationSection';
import RSVPSection from '@/app/components/RSVPSection';
import PoweredBy from '@/app/components/PoweredBy';
import FallingPetals from '@/app/components/FallingPetals';
import MobileNavigation from '@/app/components/MobileNavigation';

interface ClientECardPageProps {
  clientData: any;
}

export default function ClientECardPage({ clientData }: ClientECardPageProps) {
  const defaultLayoutOrder = [
    "hero",
    "couple",
    "schedule",
    "gallery",
    "countdown",
    "colorTheme",
    "gift",
    "rsvp",
    "location",
    "poweredBy",
    "mobileNav"
  ];

  const rawLayoutOrder = clientData.layoutOrder || defaultLayoutOrder;
  const layoutOrder = Array.isArray(rawLayoutOrder) 
    ? rawLayoutOrder
        .map((item: any) => (typeof item === 'string' ? { id: item, isActive: true } : item))
        .filter((item: any) => item && item.isActive !== false)
        .map((item: any) => item.id)
    : defaultLayoutOrder;

  const renderSection = (section: string) => {
    switch (section) {
      case 'hero': return <Box id="home" key="hero"><HeroSection data={clientData.hero} /></Box>;
      case 'couple': return <CoupleSection key="couple" data={{ brideName: clientData.brideName, groomName: clientData.groomName, ...(clientData.coupleSection as any) }} />;
      case 'schedule':
        return (
          <Box id="schedule" key="schedule">
            <ScheduleSection
              data={clientData.scheduleSection as any}
              eventDate={clientData.eventDate}
              brideParents={{
                father: (clientData.coupleSection as any)?.brideFather,
                mother: (clientData.coupleSection as any)?.brideMother
              }}
              groomParents={{
                father: (clientData.coupleSection as any)?.groomFather,
                mother: (clientData.coupleSection as any)?.groomMother
              }}
              dressCode={clientData.dressCodeSection as any}
              brideName={(clientData.coupleSection as any)?.brideName}
              groomName={(clientData.coupleSection as any)?.groomName}
            />
          </Box>
        );
      case 'gallery': return <Box id="gallery" key="gallery"><GallerySection data={clientData.galleryImages as any} /></Box>;
      case 'countdown': return <Box id="countdown" key="countdown"><CountdownSection data={clientData.countdownSection as any} eventDate={clientData.eventDate} brideName={clientData.brideName} groomName={clientData.groomName} venueName={(clientData.locationSection as any)?.venueName} /></Box>;
      case 'gift':
      case 'giftMoney':
        return <GiftSection key="gift" data={clientData.giftSection} />;
      case 'rsvp': return <Box id="rsvp" key="rsvp"><RSVPSection clientId={clientData.id} primaryColor={clientData.primaryColor} /></Box>;
      case 'location':
      case 'venue':
        return <Box id="location" key="location"><LocationSection data={clientData.locationSection as any} /></Box>;
      case 'poweredBy': return <PoweredBy key="poweredBy" />;
      case 'mobileNav': return <MobileNavigation key="mobileNav" items={(clientData.mobileNavSection as any)?.items || []} primaryColor={clientData.primaryColor} />;
      default: return null;
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100%',
      mx: 'auto',
      overflowX: 'hidden',
      bgcolor: clientData.secondaryColor || '#faf9f6',
      color: 'text.primary',
      fontFamily: clientData.fontFamily ? `'${clientData.fontFamily}', "Prompt", sans-serif` : '"Prompt", sans-serif',
      '--script-font': clientData.fontFamily ? `'${clientData.fontFamily}', "Prompt", cursive` : '"Parisienne", cursive',
      pb: { xs: 15, md: 0 },
      boxShadow: { lg: '0 0 80px rgba(0,0,0,0.08)' },
      position: 'relative'
    }}>
      {clientData.hero?.showFallingPetals && <FallingPetals />}
      {layoutOrder.map((section: string) => renderSection(section))}
    </Box>
  );
}
