'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import HeroSection from '@/app/components/HeroSection';
import CoupleSection from '@/app/components/CoupleSection';
import DressCodeSection from '@/app/components/DressCodeSection';
import GallerySection from '@/app/components/GallerySection';
import CountdownSection from '@/app/components/CountdownSection';
import ScheduleSection from '@/app/components/ScheduleSection';
import GiftSection from '@/app/components/GiftSection';
import LocationSection from '@/app/components/LocationSection';
import RSVPSection from '@/app/components/RSVPSection';
import PoweredBy from '@/app/components/PoweredBy';
import FallingPetals from '@/app/components/FallingPetals';
import GuestWishesForm from '@/app/components/GuestWishesForm';
import GuestbookSection from '@/app/components/GuestbookSection';
import MobileNavigation from '@/app/components/MobileNavigation';
import AudioPlayer from '@/app/components/AudioPlayer';
import InvitationCover from '@/app/components/InvitationCover';

interface ClientECardPageProps {
  clientData: any;
}

export default function ClientECardPage({ clientData }: ClientECardPageProps) {
  console.log('--- ClientECardPage Debug ---');
  console.log('Mobile Nav Items Target:', clientData.mobileNavSection?.items);
  
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Handle phased transition to avoid stuttering
  React.useEffect(() => {
    if (isCoverOpen) {
      // Delay mounting heavy content until the cover exit animation is well underway
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 1000); // 1s delay for full smoothness
      return () => clearTimeout(timer);
    }
  }, [isCoverOpen]);

  const defaultLayoutOrder = [
    "hero",
    "couple",
    "schedule",
    "dressCode",
    "gallery",
    "countdown",
    "gift",
    "rsvp",
    "location",
    "guestbook",
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
      case 'countdown': return <Box id="countdown" key="countdown"><CountdownSection data={clientData.countdownSection as any} eventDate={clientData.eventDate} brideName={clientData.brideName} groomName={clientData.groomName} venueName={(clientData.locationSection as any)?.venueName} schedules={clientData.scheduleSection as any[]} /></Box>;
      case 'gift':
      case 'giftMoney':
        return <GiftSection key="gift" data={clientData.giftSection} primaryColor={clientData.primaryColor} />;
      case 'rsvp': return <Box id="rsvp" key="rsvp"><RSVPSection clientId={clientData.id} primaryColor={clientData.primaryColor} /></Box>;
      case 'location':
      case 'venue':
        return <Box id="location" key="location"><LocationSection data={clientData.locationSection as any} /></Box>;
      case 'dressCode': return <DressCodeSection key="dressCode" data={clientData.dressCodeSection as any} />;
      case 'guestbook': return (
        <Box id="guestbook" key="guestbook">
          <GuestbookSection 
            clientId={clientData.id} 
            fontFamily={clientData.fontFamily} 
            primaryColor={clientData.primaryColor}
          />
        </Box>
      );
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
      bgcolor: '#ffffff', // Use white for the root to avoid unexpected color leaks
      color: 'text.primary',
      fontFamily: clientData.fontFamily ? `'${clientData.fontFamily}', "Prompt", sans-serif` : '"Prompt", sans-serif',
      '--script-font': clientData.fontFamily ? `'${clientData.fontFamily}', "Prompt", cursive` : '"Parisienne", cursive',
      boxShadow: { lg: '0 0 80px rgba(0,0,0,0.08)' },
      position: 'relative'
    }}>
      <InvitationCover 
        brideName={clientData.brideName} 
        groomName={clientData.groomName} 
        eventDate={clientData.hero?.eventDate}
        googleMapsUrl={(clientData.locationSection as any)?.googleMapExternal}
        onOpen={() => setIsCoverOpen(true)}
        primaryColor={clientData.primaryColor}
      />
      
      {/* 
          Content Container: 
          - Hidden until mounted to prevent hydration flash
          - Hidden while cover is active to prevent 'peeking' through transparent parts if any
      */}
      <Box sx={{
        opacity: isCoverOpen ? 1 : 0,
        visibility: isCoverOpen ? 'visible' : 'hidden',
        transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
        display: mounted ? 'block' : 'none',
        bgcolor: clientData.secondaryColor || '#faf9f6',
        willChange: 'opacity',
      }}>
        {clientData.hero?.showFallingPetals && isCoverOpen && <FallingPetals />}
        {isCoverOpen && (
          <AudioPlayer 
            primaryColor={clientData.primaryColor} 
            audioUrl={clientData.musicUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"} 
          />
        )}
        {layoutOrder.map((section: string) => {
          // Optimization: Only render HeroSection initially
          if (section === 'hero') return renderSection(section);
          if (showContent) return renderSection(section);
          return null;
        })}
      </Box>
    </Box>
  );
}
