'use client';

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import CalendarButton from './CalendarButton';
import dayjs from 'dayjs';
import { getFontFamily, isThai } from '../utils/fontHelper';

interface CountdownData {
  title?: string;
  subtitle?: string;
}

export default function CountdownSection({ data, eventDate, brideName, groomName, venueName }: { 
  data?: CountdownData; 
  eventDate?: Date;
  brideName?: string;
  groomName?: string;
  venueName?: string;
}) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const target = eventDate ? dayjs(eventDate).valueOf() : dayjs('2026-05-14').valueOf();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => {
      const now = dayjs().valueOf();
      const distance = target - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [target]);

  // Prevent hydration flicker
  if (!isClient) return <Box sx={{ minHeight: '300px' }} />;

  const TimeUnit = ({ label, value }: { label: string; value: number }) => (
    <Box sx={{ 
      textAlign: 'center', 
      minWidth: { xs: '80px', md: '120px' },
      px: { xs: 0, md: 2 }
    }}>
      <Typography sx={{ 
        fontFamily: 'var(--script-font, "Parisienne", cursive)', 
        fontSize: { xs: '2.5rem', md: '4.5rem' }, 
        color: '#1a1a1a',
        lineHeight: 1,
        fontWeight: 400
      }}>
        {value.toString().padStart(2, '0')}
      </Typography>
      <Typography sx={{ 
        fontFamily: '"Prompt", sans-serif', 
        fontSize: '0.65rem', 
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: '#8e7d5d',
        mt: 1,
        fontWeight: 600
      }}>
        {label}
      </Typography>
    </Box>
  );

  return (
    <Box component="section" sx={{ py: { xs: 5, md: 8 }, backgroundColor: '#ffffff', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle Background Pattern */}
      <Box sx={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'radial-gradient(#8e7d5d 1px, transparent 1px)', backgroundSize: '40px 40px', zIndex: 0 }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="overline" sx={{ color: '#8e7d5d', letterSpacing: '0.6em', fontSize: '0.75rem', mb: 2, display: 'block' }}>
            {data?.subtitle || 'Counting Down Today'}
          </Typography>
          <Typography sx={{ 
            fontFamily: getFontFamily(data?.title || 'Until Forever Begins'), 
            fontSize: isThai(data?.title || 'Until Forever Begins') ? { xs: '1.8rem', md: '2.8rem' } : { xs: '3rem', md: '4.5rem' }, 
            color: '#1a1a1a', 
            fontWeight: isThai(data?.title || 'Until Forever Begins') ? 600 : 400,
            lineHeight: 1.2 
          }}>
            {data?.title || 'Until Forever Begins'}
          </Typography>
        </Box>

        <Stack direction="row" justifyContent="center" alignItems="center" spacing={{ xs: 0, md: 2 }} sx={{ mb: 6 }}>
          <TimeUnit label="Days" value={timeLeft.days} />
          <Box sx={{ height: '40px', width: '1px', backgroundColor: 'rgba(142,125,93,0.3)', mt: -4 }} />
          <TimeUnit label="Hours" value={timeLeft.hours} />
          <Box sx={{ height: '40px', width: '1px', backgroundColor: 'rgba(142,125,93,0.3)', mt: -4 }} />
          <TimeUnit label="Mins" value={timeLeft.minutes} />
          <Box sx={{ height: '40px', width: '1px', backgroundColor: 'rgba(142,125,93,0.3)', mt: -4 }} />
          <TimeUnit label="Secs" value={timeLeft.seconds} />
        </Stack>

        <Box sx={{ textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1.5 }}>
            <Typography sx={{ fontFamily: '"Prompt", sans-serif', fontSize: '0.75rem', letterSpacing: '0.4em', color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', fontWeight: 500 }}>
              {eventDate ? dayjs(eventDate).format('MMMM DD, YYYY') : 'MAY 14, 2026'}
            </Typography>
          </motion.div>
          
          <Box sx={{ mt: 4 }}>
            <CalendarButton 
              eventDate={eventDate} 
              brideName={brideName} 
              groomName={groomName} 
              venueName={venueName} 
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
