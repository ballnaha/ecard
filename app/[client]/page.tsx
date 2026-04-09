import React from 'react';
import { Box, Typography } from '@mui/material';
import prisma from '@/lib/prisma';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
import ClientECardPage from './ClientECardPage';
import { notFound } from 'next/navigation';

export default async function ClientWeddingECard({
  params,
}: {
  params: Promise<{ client: string }>;
}) {
  const { client: slug } = await params;

  if (!slug) {
    return notFound();
  }

  // Fetch data on server
  const client = await prisma.client.findUnique({
    where: { slug },
  });

  if (!client) {
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

  // Map DB fields → frontend-friendly shape (Same logic as API)
  const heroSection = (client.heroSection as any) || {};
  const hero = {
    groomName: client.groomName,
    brideName: client.brideName,
    eventDate: dayjs(client.eventDate).utc().utcOffset(7).format('DD . MM . YY'),
    locationText: heroSection.locationText || '',
    mediaType: heroSection.mediaType || 'video',
    heroStyle: heroSection.heroStyle || 'classic',
    heroNameImage: heroSection.heroNameImage || '',
    showFallingPetals: !!heroSection.showFallingPetals,
    heroVideo: heroSection.heroVideo || '',
    heroImage: heroSection.heroImage || '',
    heroPoster: heroSection.heroPoster || '',
    heroBackgroundColor: heroSection.heroBackgroundColor || '#ffffff',
    hideAllText: !!heroSection.hideAllText,
    coverBgType: heroSection.coverBgType || 'default',
    coverBgColor: heroSection.coverBgColor || '#fdfcf0',
    coverBgImage: heroSection.coverBgImage || '',
  };

  const clientData = {
    id: client.id,
    slug: client.slug,
    brideName: client.brideName,
    groomName: client.groomName,
    eventDate: client.eventDate,
    primaryColor: client.primaryColor,
    secondaryColor: client.secondaryColor,
    fontFamily: client.fontFamily,
    musicUrl: client.musicUrl,
    layoutOrder: client.layoutOrder || null,
    hero,
    coupleSection: (client.coupleSection as any) || { 
      introText: 'Two paths that led to one beautiful journey...', 
      bridePic: '', 
      groomPic: '', 
      coupleStyle: 'arch-duo' 
    },
    scheduleSection: client.scheduleSection || null,
    locationSection: client.locationSection || null,
    galleryImages: client.galleryImages || null,
    countdownSection: client.countdownSection || null,
    dressCodeSection: client.dressCodeSection || null,
    giftSection: client.giftSection || null,
    mobileNavSection: client.mobileNavSection || null,
  };

  return <ClientECardPage clientData={clientData} />;
}
