'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import HeroSection from '@/app/components/HeroSection';
import CoupleSection from '@/app/components/CoupleSection';
import GallerySection from '@/app/components/GallerySection';
import CountdownSection from '@/app/components/CountdownSection';
import ScheduleSection from '@/app/components/ScheduleSection';
import DressCodeSection from '@/app/components/DressCodeSection';
import GiftSection from '@/app/components/GiftSection';
import LocationSection from '@/app/components/LocationSection';
import RSVPSection from '@/app/components/RSVPSection';
import PoweredBy from '@/app/components/PoweredBy';
import FallingPetals from '@/app/components/FallingPetals';
import MobileNavigation from '@/app/components/MobileNavigation';
import { useParams } from 'next/navigation';

export default function ClientWeddingECard() {
  const params = useParams();
  const slug = params.client as string;

  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/client/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('ไม่พบข้อมูลลูกค้า');
        return res.json();
      })
      .then(data => {
        setClientData(data);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  // Loading state
  if (loading) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#faf9f6', gap: 3 }}>
        <CircularProgress sx={{ color: '#8e7d5d' }} size={48} />
        <Typography sx={{ fontFamily: '"Prompt", sans-serif', color: '#8e7d5d', fontSize: '0.9rem', letterSpacing: '0.1em' }}>
          กำลังโหลด E-Card...
        </Typography>
      </Box>
    );
  }

  // Error / Not found
  if (error || !clientData) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#faf9f6', gap: 2, p: 4, textAlign: 'center' }}>
        <Typography sx={{ fontSize: '4rem' }}>💌</Typography>
        <Typography variant="h5" sx={{ fontFamily: '"Prompt", sans-serif', color: '#8e7d5d', fontWeight: 700 }}>
          ไม่พบ E-Card
        </Typography>
        <Typography sx={{ fontFamily: '"Prompt", sans-serif', color: '#94a3b8', fontSize: '0.9rem' }}>
          ลิงก์นี้อาจไม่ถูกต้อง หรือ E-Card ยังไม่ได้เปิดใช้งาน
        </Typography>
      </Box>
    );
  }

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
  const layoutOrder = clientData.layoutOrder || defaultLayoutOrder;

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
      case 'dressCode': 
      case 'dresscodesection':
      case 'DressCode':
        return null; // Merged into Schedule
      case 'gift':
      case 'giftMoney':
        return <GiftSection key="gift" data={clientData.giftSection} />;
      case 'rsvp': return <Box id="rsvp" key="rsvp"><RSVPSection /></Box>;
      case 'location':
      case 'venue':
        return <Box id="location" key="location"><LocationSection data={clientData.locationSection as any} /></Box>;
      case 'poweredBy': return <PoweredBy key="poweredBy" />;
      case 'mobileNav': return <MobileNavigation key="mobileNav" />;
      default: return null;
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100%',
      mx: 'auto',
      overflowX: 'hidden',
      backgroundColor: 'background.default',
      pb: { xs: 15, md: 0 },
      boxShadow: { lg: '0 0 80px rgba(0,0,0,0.08)' },
      position: 'relative'
    }}>

      {/* 0. Falling Petals Overlay (Performance Optimized) */}
      {clientData.hero?.showFallingPetals && <FallingPetals />}

      {/* Dynamic Sections from DB Config */}
      {layoutOrder.map((section: string) => renderSection(section))}
    </Box>
  );
}
